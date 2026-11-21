-- PromRegion56 skeleton
-- Чистая схема проекта: предприятия, показатели и источники не заполнены.
-- Справочник территорий сохранён для навигации и дальнейшего наполнения.

BEGIN;

DROP TABLE IF EXISTS public.metric_value_sources CASCADE;
DROP TABLE IF EXISTS public.metric_values CASCADE;
DROP TABLE IF EXISTS public.metric_catalog CASCADE;
DROP TABLE IF EXISTS public.city_annual_indicators CASCADE;
DROP TABLE IF EXISTS public.enterprise_research_status CASCADE;
DROP TABLE IF EXISTS public.data_quality_issues CASCADE;
DROP TABLE IF EXISTS public.dataset_releases CASCADE;
DROP TABLE IF EXISTS public.investment_projects CASCADE;
DROP TABLE IF EXISTS public.enterprise_sources CASCADE;
DROP TABLE IF EXISTS public.enterprise_products CASCADE;
DROP TABLE IF EXISTS public.enterprise_metrics CASCADE;
DROP TABLE IF EXISTS public.territory_metrics CASCADE;
DROP TABLE IF EXISTS public.enterprises CASCADE;
DROP TABLE IF EXISTS public.data_sources CASCADE;
DROP TABLE IF EXISTS public.industries CASCADE;
DROP TABLE IF EXISTS public.cities CASCADE;

CREATE TABLE public.cities (
    id integer PRIMARY KEY,
    name text NOT NULL,
    region text NOT NULL,
    district text,
    latitude numeric,
    longitude numeric,
    territory_type text,
    oktmo text,
    administrative_center text
);

CREATE TABLE public.industries (
    id integer PRIMARY KEY,
    name text NOT NULL,
    description text
);

CREATE TABLE public.data_sources (
    id integer PRIMARY KEY,
    name text NOT NULL,
    url text,
    source_type text,
    publication_date date,
    access_date date,
    description text
);

CREATE TABLE public.enterprises (
    id integer PRIMARY KEY,
    name text NOT NULL,
    short_name text,
    inn text,
    ogrn text,
    city_id integer REFERENCES public.cities(id),
    industry_id integer REFERENCES public.industries(id),
    okved text,
    address text,
    activity_description text,
    products text,
    website text,
    phone text,
    email text,
    latitude numeric,
    longitude numeric,
    status text,
    foundation_year integer,
    employee_category text,
    is_city_forming boolean NOT NULL DEFAULT false,
    is_major_enterprise boolean NOT NULL DEFAULT false,
    economic_role text
);

CREATE TABLE public.enterprise_metrics (
    id integer PRIMARY KEY,
    enterprise_id integer NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
    year integer NOT NULL,
    employees numeric,
    revenue numeric,
    investments numeric,
    average_salary numeric,
    source_id integer REFERENCES public.data_sources(id),
    net_profit numeric,
    assets numeric,
    taxes_paid numeric,
    production_volume numeric
);

CREATE TABLE public.enterprise_products (
    id integer PRIMARY KEY,
    enterprise_id integer NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
    product_name text NOT NULL,
    product_category text,
    description text,
    is_main boolean NOT NULL DEFAULT false,
    source_id integer REFERENCES public.data_sources(id)
);

CREATE TABLE public.enterprise_sources (
    id integer PRIMARY KEY,
    enterprise_id integer NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
    source_id integer NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    source_role text,
    notes text
);

CREATE TABLE public.investment_projects (
    id integer PRIMARY KEY,
    name text NOT NULL,
    city_id integer REFERENCES public.cities(id),
    enterprise_id integer REFERENCES public.enterprises(id) ON DELETE SET NULL,
    industry_id integer REFERENCES public.industries(id),
    status text,
    start_year integer,
    end_year integer,
    investment_amount numeric,
    jobs_created numeric,
    description text,
    source_id integer REFERENCES public.data_sources(id)
);

CREATE TABLE public.territory_metrics (
    id integer PRIMARY KEY,
    city_id integer NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    year integer NOT NULL,
    population numeric,
    average_salary numeric,
    unemployment_rate numeric,
    investments numeric,
    industrial_output numeric,
    employed_population numeric,
    enterprises_count numeric,
    industrial_enterprises_count numeric,
    source_id integer REFERENCES public.data_sources(id),
    UNIQUE (city_id, year)
);

CREATE TABLE public.metric_catalog (
    code text PRIMARY KEY,
    title text NOT NULL,
    unit text,
    category text,
    entity_type text NOT NULL
);

CREATE TABLE public.metric_values (
    id integer PRIMARY KEY,
    metric_code text NOT NULL REFERENCES public.metric_catalog(code),
    enterprise_id integer REFERENCES public.enterprises(id) ON DELETE CASCADE,
    city_id integer REFERENCES public.cities(id) ON DELETE CASCADE,
    period_year integer NOT NULL,
    value_numeric numeric NOT NULL,
    source_id integer REFERENCES public.data_sources(id),
    value_kind text,
    verification_status text,
    reporting_scope text,
    precision_kind text,
    measurement_date date,
    source_detail text,
    note text,
    CHECK (enterprise_id IS NOT NULL OR city_id IS NOT NULL)
);

CREATE TABLE public.metric_value_sources (
    metric_value_id integer NOT NULL REFERENCES public.metric_values(id) ON DELETE CASCADE,
    source_id integer NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    source_role text,
    section_or_page text,
    PRIMARY KEY (metric_value_id, source_id)
);

CREATE TABLE public.city_annual_indicators (
    city_id integer NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    year integer NOT NULL,
    metric_code text NOT NULL,
    numeric_value numeric,
    unit text,
    verification_status text,
    source_id integer REFERENCES public.data_sources(id),
    source_metric_name text,
    as_of_date date,
    coverage_note text,
    PRIMARY KEY (city_id, year, metric_code)
);

CREATE TABLE public.enterprise_research_status (
    enterprise_id integer PRIMARY KEY REFERENCES public.enterprises(id) ON DELETE CASCADE,
    priority_order integer,
    identification_status text,
    evidence_level text,
    identity_source_id integer REFERENCES public.data_sources(id),
    duplicate_candidate_id integer REFERENCES public.enterprises(id),
    review_note text,
    reviewed_at timestamp,
    last_checked_at timestamp
);

CREATE TABLE public.data_quality_issues (
    issue_key text PRIMARY KEY,
    enterprise_id integer REFERENCES public.enterprises(id) ON DELETE CASCADE,
    city_id integer REFERENCES public.cities(id) ON DELETE CASCADE,
    issue_type text,
    severity text,
    description text,
    review_status text
);

CREATE TABLE public.dataset_releases (
    release_code text PRIMARY KEY,
    release_date date NOT NULL,
    description text,
    verified_fact_rows integer NOT NULL DEFAULT 0,
    official_municipal_rows integer NOT NULL DEFAULT 0,
    source_count_new integer NOT NULL DEFAULT 0,
    imported_legacy_verified boolean NOT NULL DEFAULT false
);

COPY public.cities (id, name, region, district, latitude, longitude, territory_type, oktmo, administrative_center) FROM stdin;
1	Новотроицк	Оренбургская область	городской округ город Новотроицк	51.203	58.3267	город	53720000001	Новотроицк
2	Орск	Оренбургская область	городской округ город Орск	51.2049	58.5668	город	53723000001	Орск
3	Оренбург	Оренбургская область	городской округ город Оренбург	51.7682	55.0969	город	53701000001	Оренбург
4	Гай	Оренбургская область	Гайский муниципальный округ	51.4666	58.4552	город	53503000001	Гай
5	Бузулук	Оренбургская область	городской округ город Бузулук	52.7885	52.2539	город	53712000001	Бузулук
6	Медногорск	Оренбургская область	городской округ город Медногорск	51.40494	57.58031	город	53715000001	Медногорск
7	Переволоцкий	Оренбургская область	Переволоцкий район	\N	\N	\N	\N	\N
8	Ясный	Оренбургская область	Ясненский муниципальный округ	\N	\N	\N	\N	\N
9	Сорочинск	Оренбургская область	\N	\N	\N	\N	\N	\N
10	Соль-Илецк	Оренбургская область	Соль-Илецкий муниципальный округ	\N	\N	\N	\N	\N
11	Светлый	Оренбургская область	Светлинский район	\N	\N	\N	\N	\N
12	Кувандык	Оренбургская область	Кувандыкский муниципальный округ	\N	\N	\N	\N	\N
13	Тюльган	Оренбургская область	Тюльганский район	\N	\N	\N	\N	\N
14	Бугуруслан	Оренбургская область	\N	\N	\N	\N	\N	\N
15	Дубенский	Оренбургская область	Беляевский район	\N	\N	\N	\N	\N
16	Юный	Оренбургская область	Оренбургский район	\N	\N	\N	\N	\N
17	Нежинка	Оренбургская область	Оренбургский район	\N	\N	\N	\N	\N
18	Холодные Ключи	Оренбургская область	Оренбургский район	\N	\N	\N	\N	\N
19	Мазуровка	Оренбургская область	Оренбургский район	\N	\N	\N	\N	\N
20	Сара	Оренбургская область	Кувандыкский муниципальный округ	\N	\N	\N	\N	\N
21	Дубиновка	Оренбургская область	Кувандыкский муниципальный округ	\N	\N	\N	\N	\N
22	Акбулак	Оренбургская область	Акбулакский район	\N	\N	\N	\N	\N
23	Саракташ	Оренбургская область	Саракташский район	\N	\N	\N	\N	\N
24	Абдулино	Оренбургская область	Абдулинский муниципальный округ	\N	\N	\N	\N	\N
\.

COPY public.industries (id, name, description) FROM stdin;
1	Металлургия и металлообработка	Производство стали, чугуна, проката и металлических изделий
2	Химическая промышленность	Производство химических веществ и химической продукции
3	Машиностроение	Производство машин, оборудования и комплектующих
4	Производство строительных материалов	Цемент, бетон, строительные смеси и другая продукция
5	Пищевая промышленность	Производство продуктов питания и переработка сырья
6	Энергетика	Производство и распределение электрической и тепловой энергии
7	Добывающая промышленность	Добыча полезных ископаемых
8	Прочие отрасли	Другие направления промышленной деятельности
\.

COPY public.data_sources (id, name, url, source_type, publication_date, access_date, description) FROM stdin;

\.

COPY public.enterprises (id, name, short_name, inn, ogrn, city_id, industry_id, okved, address, activity_description, products, website, phone, email, latitude, longitude, status, foundation_year, employee_category, is_city_forming, is_major_enterprise, economic_role) FROM stdin;

\.

COPY public.enterprise_metrics (id, enterprise_id, year, employees, revenue, investments, average_salary, source_id, net_profit, assets, taxes_paid, production_volume) FROM stdin;

\.

COPY public.enterprise_products (id, enterprise_id, product_name, product_category, description, is_main, source_id) FROM stdin;

\.

COPY public.enterprise_sources (id, enterprise_id, source_id, source_role, notes) FROM stdin;

\.

COPY public.investment_projects (id, name, city_id, enterprise_id, industry_id, status, start_year, end_year, investment_amount, jobs_created, description, source_id) FROM stdin;

\.

COPY public.territory_metrics (id, city_id, year, population, average_salary, unemployment_rate, investments, industrial_output, employed_population, enterprises_count, industrial_enterprises_count, source_id) FROM stdin;

\.

INSERT INTO public.dataset_releases (
    release_code,
    release_date,
    description,
    verified_fact_rows,
    official_municipal_rows,
    source_count_new,
    imported_legacy_verified
) VALUES (
    'skeleton-2026-11-21',
    '2026-11-21',
    'Чистый шаблон PromRegion56 без предприятий, показателей и источников.',
    0,
    0,
    0,
    false
);

COMMIT;
