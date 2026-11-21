#!/usr/bin/env python3
"""Strict offline parser of e-ecolog.ru/buh/YYYY/INN pages saved as HTML.

Usage:
  python scripts/parse_saved_eecolog.py --html-dir ./saved_pages \
    --registry all_39_companies_195_bfo_urls.csv --output incremental_financial_facts.csv \
    --sql incremental_financial_facts.sql

File names: YYYY_INN.html (e.g. 2025_5616006746.html). Save legitimate publicly
accessible pages with a browser. This script never bypasses rate limits or logins.
Input figures are KND 0710099/0710096 line codes, in thousands of rubles; output is RUB.
Missing/dash is None, not zero. Later comparative statements supersede earlier statements.
"""
from __future__ import annotations
import argparse, csv, html, re
from html.parser import HTMLParser
from pathlib import Path
from collections import defaultdict

CODE_TO_METRIC={"2110":"revenue","2400":"net_profit","1600":"assets","2120":"cost_of_sales","2200":"operating_profit","2300":"profit_before_tax"}

class Tables(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tables=[];self.depth=0;self.row=None;self.cell=None;self.current=None
    def handle_starttag(self,tag,attrs):
        if tag=='table':
            self.depth+=1
            if self.depth==1:self.current=[]
        elif self.depth==1 and tag=='tr':self.row=[]
        elif self.depth==1 and tag in ('td','th') and self.row is not None:self.cell=[]
    def handle_data(self,data):
        if self.cell is not None:self.cell.append(data)
    def handle_endtag(self,tag):
        if self.depth==1 and tag in ('td','th') and self.cell is not None:
            self.row.append(' '.join(''.join(self.cell).split()));self.cell=None
        elif self.depth==1 and tag=='tr' and self.row is not None:
            self.current.append(self.row);self.row=None
        elif tag=='table' and self.depth:
            self.depth-=1
            if not self.depth:self.tables.append(self.current);self.current=None

def num(s):
    s=html.unescape(s).strip()
    if not s or s in ('-','—','–','(-)','н/д','нет данных'):return None
    negative=(s.startswith('(') and s.endswith(')'))
    s=re.sub(r'[\s\u00a0\u2009\u202f]','',s).strip('()')
    if s.startswith('+'):s=s[1:]
    if not re.fullmatch(r'-?\d+(?:[,.]\d+)?',s):return None
    v=float(s.replace(',','.')) if (',' in s or '.' in s) else int(s)
    return -abs(v) if negative and v != 0 else v

def parse_file(path,year,inn):
    content=path.read_text(encoding='utf-8',errors='replace')
    cleaned=' '.join(re.sub('<[^>]+>',' ',html.unescape(content)).split())
    if inn not in cleaned:raise ValueError(f'INN mismatch: {path}')
    if not re.search(rf'за\s+{year}\s+год',cleaned,re.I):raise ValueError(f'Wrong report year: {path}')
    if not (re.search(r'тысяч[а-я]*\s+руб',cleaned,re.I) or re.search('384\\s*[—–-]',cleaned)):
        raise ValueError(f'Unverified unit (expected code 384 = thousand RUB): {path}')
    parser=Tables();parser.feed(content)
    output=[]
    for table in parser.tables:
        headers=[]
        for row in table:
            # One row must supply headings for annual columns.
            if any('Код строки' in c for c in row):
                headers=[int(m.group(1)) if (m:=re.search(r'(20(?:2[0-5]))\s*год',c,re.I)) else None for c in row]
                continue
            if not headers:continue
            match_idx=next((i for i,c in enumerate(row) if c.strip() in CODE_TO_METRIC),None)
            if match_idx is None:continue
            code=row[match_idx].strip()
            for j in range(match_idx+1,min(len(row),len(headers))):
                observed_year=headers[j]
                if observed_year is None or not 2021<=observed_year<=2025:continue
                value=num(row[j]);
                if value is None:continue
                if code=='2120':value=abs(value)
                if not float(value).is_integer():raise ValueError(f'Noninteger thousands in {path}:{code}/{observed_year}')
                output.append(dict(inn=inn,year=observed_year,indicator=CODE_TO_METRIC[code],original_thousand_rub=int(value),amount_rub=int(value)*1000,source_year=year,source_url=f'https://e-ecolog.ru/buh/{year}/{inn}'))
    if not output:raise ValueError(f'No 1600/2110/2400 table rows parsed: {path}. Inspect the HTML before importing.')
    return output

def quote(s):return "'"+str(s).replace("'","''")+"'"

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--html-dir',type=Path,required=True)
    ap.add_argument('--registry',type=Path,required=True)
    ap.add_argument('--output',type=Path,required=True)
    ap.add_argument('--sql',type=Path,required=True)
    args=ap.parse_args()
    with args.registry.open(encoding='utf-8-sig') as f: registry=list(csv.DictReader(f,delimiter=';'))
    lookup={r['ИНН']:int(r['enterprise_id']) for r in registry}
    combined={};errors=[];files=0
    for entry in args.html_dir.glob('*.html'):
        m=re.fullmatch(r'(202[1-5])_(\d{10}|\d{12})\.html',entry.name)
        if not m:continue
        year,inn=int(m[1]),m[2]
        if inn not in lookup:errors.append(f'Not a registered enterprise: {entry}');continue
        try:
            for r in parse_file(entry,year,inn):
                key=(inn,r['year'],r['indicator'])
                if key not in combined or r['source_year']>combined[key]['source_year']:
                    combined[key]=r
            files+=1
        except Exception as e:errors.append(str(e))
    if errors:print('\n'.join('SKIPPED: '+x for x in errors))
    rows=sorted(combined.values(),key=lambda r:(lookup[r['inn']],r['indicator'],r['year']))
    args.output.parent.mkdir(parents=True,exist_ok=True)
    with args.output.open('w',encoding='utf-8-sig',newline='') as f:
        wr=csv.DictWriter(f,fieldnames=['enterprise_id',*rows[0].keys()] if rows else ['enterprise_id','inn','year','indicator','original_thousand_rub','amount_rub','source_year','source_url'],delimiter=';')
        wr.writeheader()
        for r in rows:wr.writerow({'enterprise_id':lookup[r['inn']],**r})
    sql=["-- Requires tables created by database/promregion56_bfo_v6_patch.sql",'BEGIN;']
    for r in rows:
        sql.append(f"INSERT INTO public.eecolog_financial_facts (enterprise_id,inn,report_year,indicator,amount_rub,original_thousand_rub,source_year,source_url,source_status,note) VALUES ({lookup[r['inn']]},{quote(r['inn'])},{r['year']},{quote(r['indicator'])},{r['amount_rub']},{r['original_thousand_rub']},{r['source_year']},{quote(r['source_url'])},'source_checked',NULL) ON CONFLICT(enterprise_id,report_year,indicator) DO UPDATE SET amount_rub=EXCLUDED.amount_rub,original_thousand_rub=EXCLUDED.original_thousand_rub,source_year=EXCLUDED.source_year,source_url=EXCLUDED.source_url;")
    sql+=['COMMIT;']
    args.sql.write_text('\n'.join(sql)+'\n',encoding='utf-8')
    print(f'Parsed {files} HTML pages; {len(rows)} unique facts; {len(errors)} skipped. Nothing fabricated.')

if __name__=='__main__':main()
