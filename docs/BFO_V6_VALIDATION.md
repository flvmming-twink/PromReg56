# Проверки перед публикацией

## PostgreSQL (на тестовой копии)

Проверка состава городов/предприятий:

```sql
SELECT c.name, COUNT(e.id) AS companies
FROM public.cities c LEFT JOIN public.enterprises e ON e.city_id=c.id
GROUP BY c.id,c.name ORDER BY c.name;
-- Ожидается 15, 19, 5 предприятий в трёх городах соответственно.
```

Число проверенных БФО фактов и штатов:

```sql
SELECT COUNT(*) AS bfo_values, COUNT(DISTINCT enterprise_id) AS companies
FROM public.eecolog_financial_facts;
-- Ожидается 140 и 8.
SELECT COUNT(*) AS headcount_rows, COUNT(DISTINCT enterprise_id) AS companies
FROM public.enterprise_staff_annual;
-- Ожидается 35 и 15.
```

Проверка конвертации сумм, периодов и ИНН:

```sql
SELECT * FROM public.eecolog_financial_facts
WHERE amount_rub <> original_thousand_rub * 1000
   OR report_year NOT BETWEEN 2021 AND 2025;
-- 0 строк
SELECT f.enterprise_id, f.inn, e.inn FROM public.eecolog_financial_facts f
JOIN public.enterprises e ON e.id=f.enterprise_id WHERE f.inn IS DISTINCT FROM e.inn;
-- 0 строк
SELECT * FROM public.v_enterprise_staff_latest ORDER BY enterprise_id;
-- последний действительно найденный год для каждого из 15 предприятий
```

Проверка 3+ лет в самостоятельно собранной БФО:

```sql
SELECT enterprise_id, indicator, COUNT(DISTINCT report_year) AS years
FROM public.eecolog_financial_facts
GROUP BY enterprise_id,indicator
HAVING COUNT(DISTINCT report_year) >= 3;
-- 26 строк (не считая серий, дополненных прежними данными).
```

## Клиентская витрина

```sh
node scripts/build-data.mjs
node --check app.js
node --check data.js
```

Ожидания: `data.enterprises.length == 39`, `data.cities.length == 3`, `data.enterprise_staff_latest.length == 15`, `data.eecolog_verification_stats.verified_facts == 140`.

## Ручная проверка

- Открыть карты и фильтры. В городах нет иных населённых пунктов.
- Открыть паспорт ОРМЕТ: значение выручки за 2025 год **9 353 553 000 ₽**; точный tooltip, а не `9,4 млрд`.
- Открыть паспорт «Оренбургский пропант»: выручка за 2025 год **6 775 672 000 ₽**; последний подтверждённый год среднесписочной численности — **2025, 1 412 чел.**
- «Новотроицкий содовый завод»: актуальное число сотрудников на **2025** год — **517 чел.**
- Провести мышью над точками, перейти клавишей Tab, убедиться, что год/число/единица считываются и не обрезаны.
- Проверить отсутствие точек вместо `null` и соблюдение интервалов года на оси X.
- Для предприятий с одиночной численностью есть поле последнего года, но нет нового искусственного графика из 1–2 точек.
- В источниках паспорта не более 2 ссылок.
- Старые `pending` значения не должны превращаться в `verified` без подтверждения.
- Если в `app.js`, `styles.css`, `build-data.mjs` были изменения после 22.11.2026, проверить diff и исправить конфликты вручную.

**Ограничения:** окружение подготовки пакета не содержит PostgreSQL/psql, поэтому SQL не тестировался на сервере. Скрипт обработки сохранённых HTML протестирован на синтетической таблице, но не гарантирует поддержку будущих вариантов страниц e-ecolog. Публикация сайта и коммит GitHub не выполнялись.
