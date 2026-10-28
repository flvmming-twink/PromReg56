--
-- PostgreSQL database dump
--

\restrict unbH1b4KFdZAMcvn3bsQqEoz2AOZUcM1PbSPNYVkgGacoteQpWd32oi0b366MYp

-- Dumped from database version 18.6 (Postgres.app)
-- Dumped by pg_dump version 18.6 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    region character varying(150) NOT NULL,
    district character varying(150),
    latitude double precision,
    longitude double precision,
    territory_type character varying(100),
    oktmo character varying(20),
    administrative_center character varying(150)
);


--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: data_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_sources (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    url text,
    source_type character varying(100),
    publication_date date,
    access_date date,
    description text
);


--
-- Name: data_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.data_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: data_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.data_sources_id_seq OWNED BY public.data_sources.id;


--
-- Name: enterprise_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enterprise_metrics (
    id integer NOT NULL,
    enterprise_id integer NOT NULL,
    year integer NOT NULL,
    employees integer,
    revenue numeric,
    investments numeric,
    average_salary numeric,
    source_id integer,
    net_profit numeric,
    assets numeric,
    taxes_paid numeric,
    production_volume numeric
);


--
-- Name: COLUMN enterprise_metrics.net_profit; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.enterprise_metrics.net_profit IS 'Чистая прибыль за год, руб.';


--
-- Name: COLUMN enterprise_metrics.assets; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.enterprise_metrics.assets IS 'Активы предприятия на конец года, руб.';


--
-- Name: COLUMN enterprise_metrics.taxes_paid; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.enterprise_metrics.taxes_paid IS 'Уплаченные налоги за год, руб.';


--
-- Name: COLUMN enterprise_metrics.production_volume; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.enterprise_metrics.production_volume IS 'Объем производства, если показатель опубликован';


--
-- Name: enterprise_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.enterprise_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: enterprise_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.enterprise_metrics_id_seq OWNED BY public.enterprise_metrics.id;


--
-- Name: enterprise_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enterprise_products (
    id integer NOT NULL,
    enterprise_id integer NOT NULL,
    product_name character varying(255) NOT NULL,
    product_category character varying(150),
    description text,
    is_main boolean DEFAULT false,
    source_id integer
);


--
-- Name: enterprise_products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.enterprise_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: enterprise_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.enterprise_products_id_seq OWNED BY public.enterprise_products.id;


--
-- Name: enterprise_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enterprise_sources (
    id integer NOT NULL,
    enterprise_id integer NOT NULL,
    source_id integer NOT NULL,
    source_role character varying(100),
    notes text
);


--
-- Name: enterprise_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.enterprise_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: enterprise_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.enterprise_sources_id_seq OWNED BY public.enterprise_sources.id;


--
-- Name: enterprises; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enterprises (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    short_name character varying(250),
    inn character varying(12),
    ogrn character varying(15),
    city_id integer NOT NULL,
    industry_id integer NOT NULL,
    okved character varying(20),
    address text,
    activity_description text,
    products text,
    website character varying(255),
    phone character varying(50),
    email character varying(150),
    latitude double precision,
    longitude double precision,
    status character varying(50),
    foundation_year integer,
    employee_category character varying(100),
    is_city_forming boolean DEFAULT false,
    is_major_enterprise boolean DEFAULT false,
    economic_role character varying(150)
);


--
-- Name: COLUMN enterprises.economic_role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.enterprises.economic_role IS 'Роль предприятия в экономике территории';


--
-- Name: enterprises_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.enterprises_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: enterprises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.enterprises_id_seq OWNED BY public.enterprises.id;


--
-- Name: industries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.industries (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    description text
);


--
-- Name: industries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.industries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: industries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.industries_id_seq OWNED BY public.industries.id;


--
-- Name: investment_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.investment_projects (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    city_id integer,
    enterprise_id integer,
    industry_id integer,
    status character(100),
    start_year integer,
    end_year integer,
    investment_amount numeric(18,0),
    jobs_created integer,
    description text,
    source_id integer
);


--
-- Name: investment_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.investment_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: investment_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.investment_projects_id_seq OWNED BY public.investment_projects.id;


--
-- Name: territory_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.territory_metrics (
    id integer NOT NULL,
    city_id integer,
    year integer NOT NULL,
    population integer,
    average_salary numeric(12,2),
    unemployment_rate numeric(5,2),
    investments numeric(18,2),
    industrial_output numeric(18,2),
    employed_population integer,
    enterprises_count integer,
    industrial_enterprises_count integer,
    source_id integer
);


--
-- Name: territory_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.territory_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: territory_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.territory_metrics_id_seq OWNED BY public.territory_metrics.id;


--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: data_sources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_sources ALTER COLUMN id SET DEFAULT nextval('public.data_sources_id_seq'::regclass);


--
-- Name: enterprise_metrics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_metrics ALTER COLUMN id SET DEFAULT nextval('public.enterprise_metrics_id_seq'::regclass);


--
-- Name: enterprise_products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_products ALTER COLUMN id SET DEFAULT nextval('public.enterprise_products_id_seq'::regclass);


--
-- Name: enterprise_sources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_sources ALTER COLUMN id SET DEFAULT nextval('public.enterprise_sources_id_seq'::regclass);


--
-- Name: enterprises id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprises ALTER COLUMN id SET DEFAULT nextval('public.enterprises_id_seq'::regclass);


--
-- Name: industries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industries ALTER COLUMN id SET DEFAULT nextval('public.industries_id_seq'::regclass);


--
-- Name: investment_projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_projects ALTER COLUMN id SET DEFAULT nextval('public.investment_projects_id_seq'::regclass);


--
-- Name: territory_metrics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.territory_metrics ALTER COLUMN id SET DEFAULT nextval('public.territory_metrics_id_seq'::regclass);


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cities (id, name, region, district, latitude, longitude, territory_type, oktmo, administrative_center) FROM stdin;
1	Новотроицк	Оренбургская область	\N	51.203	58.3267	\N	\N	\N
2	Орск	Оренбургская область	\N	51.2049	58.5668	\N	\N	\N
3	Оренбург	Оренбургская область	\N	51.7682	55.0969	\N	\N	\N
4	Гай	Оренбургская область	Гайский муниципальный округ	51.4666	58.4552	город	53503000001	Гай
5	Бузулук	Оренбургская область	городской округ город Бузулук	52.7885	52.2539	город	53712000001	Бузулук
6	Медногорск	Оренбургская область	городской округ город Медногорск	51.40494	57.58031	город	53715000001	Медногорск
15	Дубенский	Оренбургская область	Беляевский район	\N	\N	\N	\N	\N
16	Юный	Оренбургская область	Оренбургский район	\N	\N	\N	\N	\N
17	Нежинка	Оренбургская область	Оренбургский район	\N	\N	\N	\N	\N
18	Холодные Ключи	Оренбургская область	Оренбургский район	\N	\N	\N	\N	\N
19	Мазуровка	Оренбургская область	Оренбургский район	\N	\N	\N	\N	\N
12	Кувандык	Оренбургская область	Кувандыкский муниципальный округ	\N	\N	\N	\N	\N
20	Сара	Оренбургская область	Кувандыкский муниципальный округ	\N	\N	\N	\N	\N
21	Дубиновка	Оренбургская область	Кувандыкский муниципальный округ	\N	\N	\N	\N	\N
10	Соль-Илецк	Оренбургская область	Соль-Илецкий муниципальный округ	\N	\N	\N	\N	\N
8	Ясный	Оренбургская область	Ясненский муниципальный округ	\N	\N	\N	\N	\N
9	Сорочинск	Оренбургская область	\N	\N	\N	\N	\N	\N
14	Бугуруслан	Оренбургская область	\N	\N	\N	\N	\N	\N
22	Акбулак	Оренбургская область	Акбулакский район	\N	\N	\N	\N	\N
23	Саракташ	Оренбургская область	Саракташский район	\N	\N	\N	\N	\N
24	Абдулино	Оренбургская область	Абдулинский муниципальный округ	\N	\N	\N	\N	\N
11	Светлый	Оренбургская область	Светлинский район	\N	\N	\N	\N	\N
13	Тюльган	Оренбургская область	Тюльганский район	\N	\N	\N	\N	\N
7	Переволоцкий	Оренбургская область	Переволоцкий район	\N	\N	\N	\N	\N
\.


--
-- Data for Name: data_sources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.data_sources (id, name, url, source_type, publication_date, access_date, description) FROM stdin;
1	Программа развития муниципального образования город Новотроицк	https://base.garant.ru/408025329/1b93c134b90c6071b4dc3f495464b753/	Муниципальный нормативный документ	2023-11-14	2026-09-06	Сведения о крупных и средних предприятиях Новотроицка и структуре промышленности
2	АО «Уральская Сталь» — официальный сайт	https://uralsteel.com/	Официальный сайт предприятия	\N	2026-09-06	Информация о предприятии, продукции и деятельности АО «Уральская Сталь»
3	ООО «Оренбургский пропант» — официальный сайт	https://orenpropant.ru/	Официальный сайт предприятия	\N	2026-09-06	Информация о производстве пропантов, численности работников и инвестициях
4	АО «Новотроицкий цементный завод» — официальный сайт	https://novocement.ru/	Официальный сайт предприятия	\N	2026-09-06	Информация о деятельности и продукции Новотроицкого цементного завода
5	AKKERMANN CEMENT — официальный сайт	https://akkermann.ru/kratkaya-informacziya-o-kompanii/	Официальный сайт предприятия	\N	2026-09-06	Информация о производственных мощностях и деятельности ООО «АККЕРМАНН ЦЕМЕНТ»
6	АО «Новотроицкий завод хромовых соединений»	http://www.nzhs.ru/	Официальный сайт предприятия	\N	2026-09-06	Информация об АО «НЗХС», химической и металлургической продукции
7	АО «ЮУЗМС» — официальный сайт	https://xn--g1akpf8c.xn--p1ai/	Официальный сайт предприятия	\N	2026-09-08	Производство сульфата магния, удобрений и кормовых добавок; новости и вакансии 2026 года.
8	ООО «ЮМЗ» — официальный сайт	https://www.oooyumz.ru/contact	Официальный сайт предприятия	\N	2026-09-08	Реквизиты, адрес, контакты и номенклатура Южноуральского механического завода.
9	ПАО «Долина» — раскрытие информации 2026	https://e-disclosure.azipi.ru/messages/4553884/	Раскрытие информации эмитента	2026-06-17	2026-09-08	Актуальные на 2026 год сведения об эмитенте, ИНН, ОГРН и адресе.
10	ПАО «Долина» — официальный сайт	https://ao-dolina.com/about/	Официальный сайт предприятия	\N	2026-09-08	Реквизиты, адрес, контакты и сведения о производстве Кувандыкского завода КПО «Долина».
11	АО «Саринский элеватор» — Ростехнадзор	https://www.gosnadzor.ru/energy/energy/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D0%BA%20%D0%9F%D0%91_3%20%D0%B8%204%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81.pdf	Официальный государственный источник	\N	2026-09-08	Подтверждение эксплуатации объектов АО «Саринский элеватор» в 2026 году.
12	ООО МП «ПромСтройМаш» — официальный сайт	https://stanki-psm.ru/company/	Официальный сайт предприятия	\N	2026-09-08	Производственная площадка в Кувандыке, производство и ремонт металлообрабатывающего оборудования.
13	ООО «Хлебокомбинат» — сведения о юридическом лице	https://companies.rbc.ru/id/1025600752825-ooo-hlebokombinat/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД и статус Кувандыкского хлебокомбината.
14	ООО «КЗМП» — официальный сайт	https://stankopromservis.ru/about	Официальный сайт предприятия	\N	2026-09-08	Сведения о Кувандыкском заводе механических прессов и выпускаемом оборудовании.
15	АО «Дубиновское ХПП» — сведения о юридическом лице	https://companies.rbc.ru/id/1025600752616-ao-dubinovskoe-hlebopriemnoe-predpriyatie/	Открытый реестр юридических лиц	\N	2026-09-08	Реквизиты и сведения о действующем Дубиновском хлебоприемном предприятии.
16	ООО «Хлебокомбинат» — декларация соответствия 2026	https://xn----7sbajahheyaepn1ca0aveqcb0fxl.xn--p1acf/document/eaes-n-ru-d-rura07v6712126/	Реестр деклараций соответствия	2026-08-28	2026-09-08	Подтверждение производства хлебобулочной продукции в Кувандыке в 2026 году.
17	АО «Криолит» — сведения о юридическом лице	https://companies.rbc.ru/amp/ogrn/1025600752814/	Открытый реестр юридических лиц	\N	2026-09-08	Реквизиты и действующий статус юридического лица АО «Криолит».
18	ООО «КЗМП» — сведения о юридическом лице	https://saby.ru/profile/5607144468-560701001	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД и действующий статус.
19	ООО «Промстанкомаш» — сведения о юридическом лице	https://companies.rbc.ru/id/1205600011033-obschestvo-s-ogranichennoj-otvetstvennostyu-promstankomash/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД и действующий статус.
20	Соль-Илецкий машиностроительный завод — производственный профиль	https://www.oborudunion.ru/company/2387066/	Отраслевой каталог	\N	2026-09-08	Сведения о специализации завода на сельскохозяйственной и прицепной технике, адрес и контакты.
21	ООО «Илецк-Строй» — сведения о юридическом лице	https://companies.rbc.ru/id/1245600004572-ooo-iletsk-stroj/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, основной ОКВЭД 23.61.1 и действующий статус производителя бетонных и цементных изделий.
104	АО «Оренбургские минералы» — отчетность 2025	https://xfirm.ru/company/5618000027	Данные ФНС и Росстата	\N	2026-09-09	Выручка и среднесписочная численность за 2025 год.
22	ЦДПС «Илецксоль» — ООО «Руссоль»	https://russalt.ru/geografiya-dobychi/czdps-ileczksol/	Официальный сайт предприятия	\N	2026-09-08	Производственная площадка в Соль-Илецке: адрес, мощность до 1,7 млн тонн соли в год, более 560 млн тонн разведанных запасов и 530 сотрудников.
23	ООО «Источник» — сведения о юридическом лице	https://companies.rbc.ru/id/1265600001820-ooo-istochnik/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД 11.07 и действующий статус производителя напитков и упакованных вод.
24	Администрация Соль-Илецкого муниципального округа — прогноз социально-экономического развития 2025–2027	https://soliletsk.ru/assets/files/economic/3040-p-ot-05.12.2024-prognoz-ser.pdf	Официальный муниципальный документ	2024-12-05	2026-09-08	Официальные показатели населения, промышленного производства, инвестиций, занятости, безработицы и заработной платы.
25	ООО «Соль-Илецкий кирпичный завод - 1» — исторические сведения	https://companies.rbc.ru/id/1125658031971-obschestvo-s-ogranichennoj-otvetstvennostyu-sol-iletskij-kirpichnyij-zavod-1/	Открытый реестр юридических лиц	\N	2026-09-08	Историческое промышленное предприятие; ликвидировано 30.10.2014.
26	ООО «Соль-Илецкий Элеватор» — официальный сайт	https://iletsk.ru/o-nas	Официальный сайт предприятия	\N	2026-09-08	Элеваторный комплекс по приемке, подработке, хранению и отгрузке зерновых, зернобобовых и масличных культур; вместимость хранения до 140 тыс. тонн.
27	ООО «Соль-Илецкий машиностроительный завод» — сведения о юридическом лице	https://companies.rbc.ru/id/1035617275583-ooo-sol-iletskij-mashinostroitelnyij-zavod/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД и действующий статус Соль-Илецкого машиностроительного завода.
28	ООО «Руссоль» — реквизиты и статус	https://companies.rbc.ru/id/1085658025650-ooo-russol/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, ОКВЭД 08.93 и действующий статус ООО «Руссоль».
29	ООО «Соль-Илецкий кирпичный завод» — исторические сведения	https://companies.rbc.ru/id/1035617270765-ooo-sol-iletskij-kirpichnyij-zavod/	Открытый реестр юридических лиц	\N	2026-09-08	Историческое промышленное предприятие; ликвидировано 20.11.2014.
30	ООО «Соль-Илецкий Элеватор» — сведения о юридическом лице	https://companies.rbc.ru/id/1215600001957-obschestvo-s-ogranichennoj-otvetstvennostyu-zvezda/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, численность и действующий статус ООО «Соль-Илецкий Элеватор».
31	ООО «Оренгипс» — исторические сведения	https://companies.rbc.ru/id/1075658012913-obschestvo-s-ogranichennoj-otvetstvennostyu-orengips/	Открытый реестр юридических лиц	\N	2026-09-08	Историческое предприятие по добыче гипсового сырья и производству гипсовых изделий; ликвидировано 01.09.2015.
32	ООО «ОММИКС» — сведения о юридическом лице	https://check.tochka.com/company/1205600003696/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, ОКВЭД 20.51, адрес и действующий статус производителя взрывчатых веществ.
33	ООО «Мастодек» — официальный сайт	https://mastodek.ru/	Официальный сайт предприятия	\N	2026-09-08	Продукция из минерально-полимерного композита, контакты и реквизиты.
34	ООО «Палето 2.0» — производственная площадка	https://tppvo.ru/site_data/s273/files/files2024/Paleto.pdf	Документ торгово-промышленной палаты	\N	2026-09-08	Подтверждение швейного производства в Ясном, адреса площадки, телефона, e-mail, ИНН и ОГРН.
35	ООО «Ясный Камень» — исторические сведения	https://companies.rbc.ru/id/1135658006945-obschestvo-s-ogranichennoj-otvetstvennostyu-yasnyij-kamen/	Открытый реестр юридических лиц	\N	2026-09-08	Историческое предприятие добычи строительного камня; ликвидировано.
36	АО «Оренбургские минералы» — контакты и реквизиты	https://orenmin.ru/kontakty/	Официальный сайт предприятия	\N	2026-09-08	ИНН, адрес, телефоны и электронная почта предприятия.
37	АО «Оренбургские минералы» — сведения о юридическом лице	https://companies.rbc.ru/id/1025602137956-ao-kiembaevskij-gorno-obogatitelnyij-kombinat-orenburgskie-mineralyi/	Открытый реестр юридических лиц	\N	2026-09-08	ОГРН, ИНН, ОКВЭД 08.99.23, действующий статус и финансовые показатели.
38	ООО «Царь-Хлеб» — ликвидационная процедура	https://companies.rbc.ru/id/1215600000131-obschestvo-s-ogranichennoj-otvetstvennostyu-tsar-hleb/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, ОКВЭД 10.71 и статус процесса ликвидации в 2026 году.
39	ТОР «Ясный» — новый проект ООО «Кераминос»	https://orenburg.media/?p=546746	Региональный информационный источник	2026-07-05	2026-09-08	Проект добычи каолина-сырца: инвестиции более 70 млн руб., 28 рабочих мест, запуск проекта в 2026 году, ввод производства в 2027 году.
40	АО «Оренбургские минералы» — официальный сайт	https://orenmin.ru/	Официальный сайт предприятия	\N	2026-09-08	Градообразующее предприятие Ясного; производство хризотила, сведения о продукции, новостях и деятельности.
41	ООО «УралПромМаш» — производство в 2025 году	https://myseldon.com/ru/news/index/327572684	Региональный информационный источник	2025-04-10	2026-09-08	Подтверждение работы машиностроительного завода и выпуска/ремонта оборудования.
42	ООО «ОМ» — экспортные переговоры 2026	https://yasvesti.ru/2026/07/28/orenburgskie-predpriyatiya-nalazhivajut-sotrudnichestvo-s-indiej/	Региональный информационный источник	2026-07-28	2026-09-08	Подтверждение действующего производства стабилизирующей добавки «Хризопро» в 2026 году.
43	ООО «ПРОМОТОР» — сведения о юридическом лице	https://companies.rbc.ru/id/1205600005940-obschestvo-s-ogranichennoj-otvetstvennostyu-promotor/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, ОКВЭД 33.17, адрес и действующий статус предприятия по ремонту железнодорожной техники.
44	ООО «ЦПМ» — сведения о юридическом лице	https://companies.rbc.ru/id/1185658006698-ooo-tspm/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, ОКВЭД 13.92.1, адрес и действующий статус.
45	ООО «Яснотекс» — производство 2025	https://yasvesti.ru/2025/05/23/tri-pary-zheleznyh-sapog-yasnoteks/	Региональный информационный источник	2025-05-23	2026-09-08	Подтверждение работы предприятия по производству спецодежды и текстильных изделий.
46	ООО «Мастодек» — сведения о юридическом лице	https://companies.rbc.ru/id/1205600013850-obschestvo-s-ogranichennoj-otvetstvennostyu-mastodek/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес и ОКВЭД 23.99.
47	ООО «ЭнергетикПлюс» — сведения о юридическом лице	https://companies.rbc.ru/id/1165658072634-ooo-energetikplyus/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, ОКВЭД 35.30.1, адрес и действующий статус в 2026 году.
48	ООО «Кераминос» — сведения о юридическом лице	https://companies.rbc.ru/id/1235600010150-ooo-ooo-keraminos/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД 08.12.2 и действующий статус юридического лица.
49	ТОР «Ясный» — обзор 12 производственных предприятий	https://pda.orsk.ru/news/126280-toser-%C2%AByasnyy%C2%BB-12-predpriyatiy-kotorye-sozdayut-unikalnye-produkty	Региональный информационный источник	\N	2026-09-08	Производственные профили ОМ, ОММИКС, Мастмастер, Мастодек, ЦПМ, УралПромМаш, Восток-СТС, ПРОМОТОР, Палето 2.0, Композит и других резидентов.
50	ООО «Ясненский хлебозавод» — актуальные сведения	https://star-pro.ru/proverka-kontragenta/organization/1065635007855--ooo-yasnenskij-xlebozavod	Открытый реестр юридических лиц	2026-07-02	2026-09-08	ИНН, ОГРН, адрес, основной профиль и действующий статус в 2026 году.
51	ООО «Мастмастер» — сведения о юридическом лице	https://companies.rbc.ru/id/1195658014452-obschestvo-s-ogranichennoj-otvetstvennostyu-mastmaster/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД 20.30, численность и действующий статус в 2026 году.
52	ООО «Яснотекс» — сведения о юридическом лице	https://companies.rbc.ru/id/1195658008435-obschestvo-s-ogranichennoj-otvetstvennostyu-yasnoteks/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес и действующий статус производителя спецодежды.
53	ООО «Керамос» — банкротство	https://check.tochka.com/company/1025602137714/	Открытый реестр юридических лиц	\N	2026-09-08	Компания в стадии банкротства; ИНН, ОГРН, ОКВЭД 08.12.2 и адрес.
54	Исторический промышленный профиль города Ясный	https://base.garant.ru/27515180/53f89421bbdaf741eb2d1ecc4ddb4c33/	Официальный региональный нормативный документ	\N	2026-09-08	Исторический перечень промышленных предприятий Ясного и их специализация.
55	ООО «ОМ» — сведения о юридическом лице	https://companies.rbc.ru/id/1165658060798-ooo-om/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД 23.99 и действующий статус.
56	ООО «Композит» — сведения о юридическом лице	https://companies.rbc.ru/id/1205600013849-obschestvo-s-ogranichennoj-otvetstvennostyu-kompozit/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, ОКВЭД 23.99, адрес и действующий статус.
57	Региональная программа развития промышленности Оренбургской области — 2026	https://base.garant.ru/414691197/5ac206a89ea76855804609cd950fcaf7/	Официальный региональный нормативный документ	2026-07-28	2026-09-08	АО «Оренбургские минералы» включено в перечень производителей Оренбургской области.
58	ООО «УралПромМаш» — сведения о юридическом лице	https://companies.rbc.ru/id/1165658070126-ooo-uralskie-promyishlennyie-mashinyi/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД 28.99, численность и действующий статус на 2026 год.
59	ООО «Ясненская пивоварня» — актуальные сведения	https://check.tochka.com/company/1195658006257/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД 11.05 и действующий статус в 2026 году.
60	ООО «Восток-СТС» — сведения о юридическом лице	https://companies.rbc.ru/id/1195658008479-obschestvo-s-ogranichennoj-otvetstvennostyu-vostok-spetstehservis/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, профиль ремонта техники и действующий статус.
61	ООО «Энергоресурс» — сведения о юридическом лице	https://companies.rbc.ru/id/1105658027067-ooo-energoresurs/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, ОКВЭД 35.30.2, адрес и действующий статус в 2026 году.
62	ООО «Компонент-Лактис» — сведения о юридическом лице	https://companies.rbc.ru/id/1175658005643-ooo-komponent-laktis/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД и действующий статус ООО «Компонент-Лактис».
63	ООО «Компонент-Лактис» — производство 2026	https://orenburzhie.ru/news/v-buguruslane-nachnut-vypusk-probiotika-novogo-pokoleniya/	Региональный информационный источник	2026-02-02	2026-09-08	Подтверждение работы биотехнологического предприятия в Бугуруслане в 2026 году.
64	ООО «БайТекс» — ФНС БФО	https://bo.nalog.gov.ru/organizations-card/6925757	Официальный источник ФНС	\N	2026-09-08	Действующий статус, ИНН, ОГРН, адрес и ОКВЭД 06.10.1.
65	АО «Оренбургнефтеотдача» — сведения о предприятии	https://saby.ru/profile/5645001990-560201001	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД и действующий статус АО «Оренбургнефтеотдача».
66	ООО «НПК «Фильтр» — официальный сайт	https://www.npk-filtr.ru/contacts	Официальный сайт предприятия	\N	2026-09-08	Реквизиты, адрес, контакты и производственная площадка НПК «Фильтр» в Бугуруслане.
67	ООО «НПК «Фильтр» — сведения о юридическом лице	https://companies.rbc.ru/id/1146319009495-ooo-nauchno-proizvodstvennaya-kompaniya-filtr/	Открытый реестр юридических лиц	\N	2026-09-08	ОКВЭД, действующий статус и сведения о предприятии.
68	ООО «Сорочинский МЭЗ» — Федеральный центр компетенций	https://xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/national-project/organizations_pages/5617020920/	Официальный федеральный ресурс	\N	2026-09-08	Подтверждение деятельности предприятия, ИНН, ОКВЭД 10.41.2 и профиль производства.
69	ООО «Сорочинский МЭЗ» — сведения о юридическом лице	https://companies.rbc.ru/amp/ogrn/1105658027012/	Открытый реестр юридических лиц	\N	2026-09-08	ОГРН, ИНН, адрес, численность и действующий статус на 2026 год.
70	ООО «Сорочинский элеватор» — Федеральный центр компетенций	https://xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/national-project/organizations_pages/5617020895/	Официальный федеральный ресурс	\N	2026-09-08	Подтверждение деятельности элеватора, ИНН и ОКВЭД 52.10.3.
71	ООО «Сорочинский элеватор» — сведения о юридическом лице	https://companies.rbc.ru/id/1105658021512-ooo-sorochinskij-elevator/	Открытый реестр юридических лиц	\N	2026-09-08	ОГРН, ИНН, адрес и действующий статус.
72	ЗАО «Сорочинский КХП» — исторические сведения	https://site.birweb.1prime.ru/company-brief/1535831	Открытый реестр юридических лиц	\N	2026-09-08	Исторический комбинат хлебопродуктов; прекращение деятельности подтверждено на 2026 год.
73	ООО «Мясокомбинат «Сорочинский» — исторические сведения	https://companies.rbc.ru/id/1195658002572-obschestvo-s-ogranichennoj-otvetstvennostyu-myasokombinat-sorochinskij/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, профиль производства и ликвидированный статус.
74	ООО «ЦРВ Абдулино» — официальный сайт	https://crv-abdulino.ru/	Официальный сайт предприятия	\N	2026-09-08	Подтверждение действующего вагоноремонтного производства в Абдулино.
75	ООО «ЦРВ Абдулино» — сведения о юридическом лице	https://companies.rbc.ru/id/1085658022977-ooo-tsentr-remonta-vagonov-abdulino/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, численность и профиль деятельности.
76	ООО «Мяско» — сведения о юридическом лице	https://check.tochka.com/company/1155658010804/	Открытый реестр юридических лиц	\N	2026-09-08	Действующий статус, ИНН, ОГРН и ОКВЭД 10.11.1.
77	ООО «Абдулинский механический завод» — сведения о юридическом лице	https://check.tochka.com/region/abdulino/	Открытый реестр юридических лиц	\N	2026-09-08	На 2026 год принято решение о предстоящем исключении юридического лица из ЕГРЮЛ.
78	ООО «ЛБ Минералс-Светлое» — инвестиционный портал Оренбургской области	https://investinorenburg.ru/projects/	Официальный региональный инвестиционный портал	\N	2026-09-08	Проект обогащения каолина: 1,3 млрд рублей инвестиций, 80 рабочих мест, статус реализован.
79	ООО «ЛБ Минералс-Светлое» — сведения о юридическом лице	https://check.tochka.com/company/1215600002892/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес, ОКВЭД и действующий статус на 2026 год.
80	АО «Элеватор Рудный Клад» — корпоративные сведения	https://e-disclosure.azipi.ru/organization/personal-pages/363353/	Раскрытие информации эмитента	\N	2026-09-08	Реквизиты и сведения о юридическом лице.
81	АО «Элеватор Рудный Клад» — судебные сведения о прекращении основной деятельности	https://base.garant.ru/38946963/	Судебный акт	2025-07-28	2026-09-08	Судом установлено отчуждение почти всего имущественного комплекса и невозможность дальнейшей деятельности по хранению зерна.
82	МКП «Светлое» — сведения о юридическом лице	https://check.tochka.com/company/1225600008567/	Открытый реестр юридических лиц	\N	2026-09-08	Действующее энергетическое предприятие, производство тепловой энергии котельными.
83	ООО «ТЭМЗ» — официальный сайт	https://temz.ru/	Официальный сайт предприятия	\N	2026-09-08	Реквизиты, адрес, контакты и сведения о действующем Тюльганском электромеханическом заводе.
84	ООО «Тюльганский машиностроительный завод» — МЧС России	https://digital.mchs.gov.ru/fgpn/license/56-06-2026-003211	Официальный государственный реестр	2026-08-01	2026-09-08	ИНН, ОГРН, адрес и действующая лицензия предприятия в 2026 году.
85	ООО «Тюльганский машиностроительный завод» — сведения о юридическом лице	https://www.tbank.ru/business/contractor/legal/1055638047299/	Открытый реестр юридических лиц	\N	2026-09-08	Действующий статус, профиль механической обработки и дополнительные производственные ОКВЭД.
86	ОАО «Переволоцкий элеватор» — официальный сайт	https://orenelevator.ru/	Официальный сайт предприятия	\N	2026-09-08	Производство пшеничной муки, гречневой крупы и отрубей; адрес и контакты.
87	ОАО «Переволоцкий элеватор» — сведения о юридическом лице	https://companies.rbc.ru/id/1025602665395-oao-perevolotskij-elevator/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, адрес и действующий статус.
88	ООО «Самара Лей» — региональная научно-технологическая программа	https://base.garant.ru/413364998/1b93c134b90c6071b4dc3f495464b753/	Официальный региональный нормативный документ	2025-12-24	2026-09-08	Предприятие в Переволоцком указано как производитель паровых котлов и блочно-модульных котельных.
89	ООО «Самара Лей» — сведения о юридическом лице	https://spark-interfax.ru/statistics/city/53237000000	Открытый реестр компаний	\N	2026-09-08	ИНН 5640005535, ОГРН 1025602667441, адрес и действующий статус.
90	ООО «ТД «Завод Коммунар» — официальный сайт	https://kommunar.com/contact/	Официальный сайт предприятия	\N	2026-09-08	Производственная площадка в Саракташе, контакты и специализация на гидрооборудовании.
91	ООО «ТД «Завод Коммунар» — реквизиты производителя	https://fabricators.ru/proizvoditel/zavod-kommunar	Отраслевой каталог производителей	2026-04-27	2026-09-08	ИНН, ОГРН и сведения о производстве гидравлического оборудования.
92	ПК «Саракташский консервный завод» — сведения о юридическом лице	https://companies.rbc.ru/id/1155658022486-pk-pk-saraktashskij-konservnyij-zavod/	Открытый реестр юридических лиц	\N	2026-09-08	ИНН, ОГРН, ОКВЭД 10.39 и действующий статус на 2026 год.
93	Саракташский консервный завод — ОблПотребСоюз	https://orenops.ru/predpriyatie.html	Официальный сайт отраслевого объединения	\N	2026-09-08	Адрес, контакты и подтверждение действующей производственной площадки.
94	ООО «Саракташский молочный завод «Анаир» — исторические сведения	https://egrul.org/5643007876	Открытые данные ЕГРЮЛ	2026-07-13	2026-09-08	Ликвидированное молочное предприятие; дата прекращения деятельности 10.01.2019.
95	ООО «Степной Барашек» — сведения о юридическом лице	https://check.tochka.com/company/1265600002106/	Открытый реестр юридических лиц	\N	2026-09-08	Новое действующее предприятие 2026 года по переработке и консервированию мяса.
96	ООО «Акмел Добыча» — сведения о ликвидации	https://reputation.ru/ogrn/1145658339474	Открытый реестр юридических лиц	2026-02-11	2026-09-08	Исторический проект добычи и переработки мела; компания ликвидирована после банкротства 11.02.2026.
97	Проект завода тонкодисперсного мела в Акбулаке	https://web-hotfix-test010.k8s.trudvsem.ru/map/region?regionCode=5600000000000	Государственный инвестиционный ресурс	\N	2026-09-08	Историческая карточка проекта ООО «Акмел Добыча»: завод тонкодисперсного мела мощностью 100 тыс. тонн в год.
98	ПК «Саракташский консервный завод» — отчетность 2025	https://www.tbank.ru/business/contractor/legal/1155658022486/	Бухгалтерская отчетность	\N	2026-09-09	Выручка за 2025 год.
99	АО «Южно-Уральский химзавод» — показатели 2025	https://firmoteka.ru/5605021799	Данные ФНС	\N	2026-09-09	Выручка и среднесписочная численность за 2025 год.
100	ООО «ТЭМЗ» — отчетность 2025	https://companies.rbc.ru/id/1035618981485-ooo-tyulganskij-elektro-mehanicheskij-zavod/	Бухгалтерская отчетность	\N	2026-09-09	Выручка за 2025 год.
101	ООО «ЛБМ-Светлое» — показатели 2025	https://b2b.house/company/OOO-LBM-SVETLOE_1d393c2f-53fa-4b90-9634-731be1e48e14/	Бухгалтерская отчетность	\N	2026-09-09	Выручка и среднесписочная численность за 2025 год.
102	АО «МЭЗ «Уралэлектро» — выручка 2025	https://birweb-qa.1prime.ru/company-brief/1534247	Бухгалтерская отчетность	\N	2026-09-09	Выручка за 2025 год. Численность на странице относится к более раннему периоду и не используется.
103	ООО «ЦРВ Абдулино» — показатели 2025	https://reputation.ru/ogrn/1085658022977	Данные ФНС	\N	2026-09-09	Выручка и среднесписочная численность за 2025 год.
105	Фирмотека — рейтинг компаний Оренбургской области за 2025 год	https://firmoteka.ru/rating-by-revenue-reg56	Данные бухгалтерской отчетности ФНС	\N	2026-09-09	Выручка и, где доступно, среднесписочная численность за 2025 год.
106	ПАО «Орскнефтеоргсинтез» — отчетность 2025	https://companies.rbc.ru/id/1025601998498-pao-orsknefteorgsintez/	Бухгалтерская отчетность	\N	2026-09-09	Выручка за 2025 год.
107	ООО «БайТекс» — отчетность 2025	https://companies.rbc.ru/id/1025600545266-ooo-bajteks/	Бухгалтерская отчетность	\N	2026-09-09	Выручка за 2025 год.
108	Гайский ГОК — РСБУ 2025	https://cbonds.ru/news/3859357/	Отчетность РСБУ	\N	2026-09-09	Выручка ПАО «Гайский ГОК» за 2025 год.
109	ОАО «Переволоцкий элеватор» — отчетность 2025	https://www.tbank.ru/business/contractor/legal/1025602665395/	Бухгалтерская отчетность	\N	2026-09-09	Выручка за 2025 год.
110	АО «РИФАР» — ФНС 2025	https://firmoteka.ru/5604009196	Данные ФНС	\N	2026-09-09	Выручка и среднесписочная численность за 2025 год.
111	ООО «Сорочинский МЭЗ» — показатели 2025	https://reputation.ru/ogrn/1105658027012	Данные ФНС	\N	2026-09-09	Выручка и среднесписочная численность за 2025 год.
112	ООО «НСплав» — показатели за 2024 год	https://b2b.house/company/OOO-NSPLAV_5e0683cc-fe00-4778-bac0-b796c4af9388/	Бухгалтерская отчетность ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2024 год — 2 807 055 000 руб.; среднесписочная численность — 154 человека.
113	ООО «Компонент-Лактис» — численность 2024	https://companium.ru/id/1175658005643-komponent-laktis	Данные ФНС / аналитический агрегатор	\N	2026-09-09	Среднесписочная численность за 2024 год — 41 человек.
114	АО «МЭЗ «Уралэлектро» — бухгалтерская отчетность за 2024 год	https://companies.rbc.ru/id/1025600752649-oao-aktsionernoe-obschestvo-mednogorskij-elektrotehnicheskij-zavod-uralelektro/	Бухгалтерская отчетность / РБК Компании	\N	2026-09-09	Выручка за 2024 год — 1 699 882 000 руб.
115	ООО «Оренбургский пропант» — показатели за 2024 год	https://companies.rbc.ru/id/1175658020449-ooo-obschestvo-s-ogranichennoj-otvetstvennostyu-orenburgskij-propant/	Бухгалтерская отчетность / РБК Компании	\N	2026-09-09	Выручка за 2024 год — 5 789 017 000 руб.
116	ООО «ЦРВ Абдулино» — показатели за 2024 год	https://b2b.house/company/OOO-CRV-ABDULINO_50674f6c-658e-40c2-8fc5-60685260e06e/	Бухгалтерская отчетность ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2024 год — 442 778 000 руб.; среднесписочная численность — 138 человек.
117	ПАО «Орскнефтеоргсинтез» — финансовые показатели 2024	https://energybase.ru/downstream/orsknefteorgsintez	Бухгалтерская отчетность / отраслевой справочник	\N	2026-09-09	Выручка за 2024 год — 24 176 919 тыс. руб.
118	ООО «Газпром добыча Оренбург» — финансовые показатели 2024	https://energybase.ru/upstream/gazprom-dobycha-orenburg	Бухгалтерская отчетность / отраслевой справочник	\N	2026-09-09	Выручка за 2024 год — 142 851 034 тыс. руб.
119	АО «ОРМЕТ» — бухгалтерская отчетность за 2024 год	https://companies.rbc.ru/id/1025602077270-ao-ormet/	Бухгалтерская отчетность / РБК Компании	\N	2026-09-09	Выручка за 2024 год — 8 457 293 000 руб.
120	ООО «ТЭМЗ» — показатели за 2024 год	https://checkspot.ru/company/1035618981485	Данные ФНС / аналитический агрегатор	\N	2026-09-09	Тюльганский электромеханический завод: выручка 412 512 000 руб.; ССЧ — 35 человек за 2024 год.
121	АО «Оренбургские минералы» — показатели за 2024 год	https://b2b.house/company/AO-ORENBURGSKIE-MINERALY_dcf15156-716e-4cfa-889d-a3306eedc9cb/	Бухгалтерская отчетность ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2024 год — 9 128 454 000 руб.; ССЧ — 1 771 человек; расчетная среднемесячная зарплата — 88 671,47 руб.
122	ООО «Оренбургский пропант» — численность и расчетная зарплата 2024	https://b2b.house/company/OOO-ORENBURGSKIJ-PROPANT_2a790637-7ae3-42d2-8a05-3d105f6c4870/	Данные ФНС / аналитический агрегатор	\N	2026-09-09	ССЧ за 2024 год — 1 473 человека; расчетная среднемесячная зарплата — 82 986,08 руб.
123	ПАО «Гайский ГОК» — бухгалтерская отчетность за 2024 год	https://companies.rbc.ru/id/1025600682030-pao-gajskij-gorno-obogatitelnyij-kombinat/	Бухгалтерская отчетность / РБК Компании	\N	2026-09-09	Выручка за 2024 год — 44 013 349 000 руб.
124	ООО «СМК ОРСК» — показатели за 2024 год	https://checkspot.ru/company/1095658013660	Данные ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2024 год — 2 947 832 000 руб.; среднесписочная численность — 554 человека.
125	ООО «Компонент-Лактис» — показатели за 2024 год	https://e-ecolog.ru/buh/2024/5602024488	Бухгалтерская отчетность ФНС и Росстата	\N	2026-09-09	Выручка за 2024 год — 88 232 000 руб.
126	ООО «БайТекс» — бухгалтерская отчетность за 2024 год	https://check.tochka.com/company/1025600545266/	Данные ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2024 год — 15 426 817 000 руб.
127	ООО «Сорочинский МЭЗ» — бухгалтерская отчетность за 2024 год	https://check.tochka.com/company/1105658027012/	Данные ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2024 год — 12 295 653 000 руб.
149	АО «РИФАР» — показатели 2022	https://synapsenet.ru/organizacii/1025600684240-ao-rifar	Бухгалтерская отчетность ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2022 год — 6 737 368 тыс. руб.
128	ООО «АСТОН-Поволжье» — показатели за 2024 год	https://checkspot.ru/company/1215600006192	Данные ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2024 год — 1 480 031 000 руб.; среднесписочная численность — 49 человек.
129	АО «Уральская Сталь» — бухгалтерская отчетность РСБУ за 2024 год	https://finolive.ru/docs/172/rsbu_year_2024.pdf	Бухгалтерская отчетность РСБУ	\N	2026-09-09	Официальная отчетность: выручка 153 749 457 тыс. руб.; среднесписочная численность 9 231 человек.
130	ООО «СМК ОРСК» — бухгалтерская отчетность 2024 с сопоставимыми данными 2023	https://companies.rbc.ru/id/1095658013660-ooo-orskij-zavod-metallokonstruktsij/	Бухгалтерская отчетность / РБК Компании	\N	2026-09-09	Выручка на начало 2024 года — 2 797 202 000 руб., соответствующая 2023 году.
131	АО «Уральская Сталь» — бухгалтерская отчетность 2024 с сопоставимыми данными 2023	https://companies.rbc.ru/id/1055607061498-ao-uralskaya-stal/	Бухгалтерская отчетность / РБК Компании	\N	2026-09-09	Выручка на начало 2024 года — 161 787 841 000 руб., соответствующая 2023 году.
132	ООО «БайТекс» — бухгалтерская отчетность за 2023 год	https://e-ecolog.ru/buh/2023/5602004322	Бухгалтерская отчетность ФНС и Росстата	\N	2026-09-09	Выручка по строке 2110 за 2023 год — 13 561 457 тыс. руб.
133	АО «Оренбургские минералы» — финансовые показатели 2023	https://synapsenet.ru/organizacii/1025602137956-ao-orenburgskie-minerali	Бухгалтерская отчетность ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2023 год — 7 726 363 тыс. руб.
134	АО «Оренбургские минералы» — численность сотрудников 2023	https://reputation.ru/ogrn/1025602137956	Данные ФНС / аналитический агрегатор	\N	2026-09-09	В 2023 году численность сотрудников составляла 1 840 человек.
135	АО «Южно-Уральский химзавод» — отчет о финансовых результатах 2023	https://dirinvest.ru/scanner/5605021799/168	Бухгалтерская отчетность	\N	2026-09-09	Выручка за 2023 год — 410 605 тыс. руб.
136	АО «РИФАР» — бухгалтерская отчетность 2024 с сопоставимыми данными 2023	https://companies.rbc.ru/id/1025600684240-ao-rifar/	Бухгалтерская отчетность / РБК Компании	\N	2026-09-09	Выручка на начало 2024 года — 6 724 520 000 руб., соответствующая 2023 году.
137	ООО «Газпромнефть-Оренбург» — бухгалтерская отчетность за 2023 год	https://companies.rbc.ru/amp/ogrn/1165658052450/	Бухгалтерская отчетность / РБК Компании	\N	2026-09-09	Выручка за 2023 год — 85 841 631 000 руб.
138	ООО «Газпром добыча Оренбург» — финансовые показатели 2023	https://liccontragent.ru/company/100242786/economics	Бухгалтерская отчетность / аналитический агрегатор	\N	2026-09-09	Выручка за 2023 год — 125 170 259 000 руб.
139	ООО «СМК ОРСК» — показатели 2022	https://b2b.house/company/OOO-SMK-ORSK_ca263574-7302-4f58-b849-afba794dc361/	Бухгалтерская отчетность ФНС / аналитический агрегатор	\N	2026-09-09	Опубликованная выручка за 2022 год — около 1,71 млрд руб.; значение округленное.
140	ООО «Оренбургский пропант» — показатели 2022	https://synapsenet.ru/organizacii/1175658020449-ooo-orenburgskij-propant	Бухгалтерская отчетность ФНС / аналитический агрегатор	\N	2026-09-09	Выручка за 2022 год — 3 579 291 тыс. руб.
141	ООО «Сорочинский МЭЗ» — бухгалтерская отчетность 2022	https://egrul.org/bo/report_all.php?inn=5617020920	Бухгалтерская отчетность на основе данных ФНС	\N	2026-09-09	Выручка за 2022 год — 5 615 518 тыс. руб.
142	ООО «ЦРВ Абдулино» — бухгалтерская отчетность 2022	https://e-ecolog.ru/buh/2022/5601020378	Бухгалтерская отчетность ФНС и Росстата	\N	2026-09-09	Строка 2110: выручка за 2022 год — 246 529 тыс. руб.
143	ОАО «Переволоцкий элеватор» — показатели 2022	https://saby.ru/profile/5640002090-564001001	Бухгалтерская отчетность / аналитический агрегатор	\N	2026-09-09	Выручка от основной деятельности за 2022 год — около 638,3 млн руб.
144	ООО «Компонент-Лактис» — показатели 2022	https://saby.ru/profile/5602024488-560201001	Бухгалтерская отчетность / аналитический агрегатор	\N	2026-09-09	Выручка от основной деятельности за 2022 год — 66 812 тыс. руб.
145	ПК «Саракташский консервный завод» — бухгалтерская отчетность 2022	https://e-ecolog.ru/buh/2022/5643022105	Бухгалтерская отчетность ФНС и Росстата	\N	2026-09-09	Строка 2110: выручка за 2022 год — 28 696 тыс. руб.
146	АО «МЭЗ «Уралэлектро» — итоги работы 2022	https://t.me/s/pool_56?before=3302	Региональный информационный источник	\N	2026-09-09	Объем реализации предприятия в 2022 году — 1,5 млрд руб. без НДС; средняя зарплата — более 32 тыс. руб.
147	ПАО «Гайский ГОК» — отчетность 2022	https://b2b.house/company/PAO-GAJSKIJ-GOK_45b029c8-778b-4226-8346-cea57496c7fe/financial-statements/	Бухгалтерская отчетность	\N	2026-09-09	Строка 2110: выручка за 2022 год — 41 334 374 тыс. руб.
148	АО «Оренбургские минералы» — анализ отчетности 2022	https://innova-science.ru/wp-content/uploads/2023/11/sbornik-nauchnyh-trudov-17.11.2023-sni-21.pdf	Научная публикация на основе бухгалтерской отчетности	2023-11-17	2026-09-09	В анализе отчетности указана выручка от продажи без НДС за 2022 год — 6 752 232 тыс. руб.
150	ООО «БайТекс» — показатели 2022	https://energybase.ru/upstream/baitex	Отраслевая финансовая база	\N	2026-09-09	Выручка за 2022 год — 12 339 628 тыс. руб.
151	ООО «Газпром добыча Оренбург» — итоги 2022	https://www.akm.ru/news/gazprom_perevel_v_pryamoe_vladenie_gazprom_dobycha_orenburg/	Финансово-деловой источник	\N	2026-09-09	Опубликованная выручка за 2022 год — 123,6 млрд руб.; значение округленное.
152	ООО «Газпромнефть-Оренбург» — показатели 2022	https://b2b.house/company/OOO-GAZPROMNEFT-ORENBURG_6e593d79-93d6-4673-8d86-db62d4167aba/	Бухгалтерская отчетность / аналитический агрегатор	\N	2026-09-09	Опубликованная выручка за 2022 год — около 84,73 млрд руб.; значение округленное.
153	АО «ОРМЕТ» — бухгалтерская отчетность 2022	https://e-ecolog.ru/buh/2022/5616006746	Бухгалтерская отчетность ФНС и Росстата	\N	2026-09-09	Строка 2110: выручка за 2022 год — 6 068 075 тыс. руб.
154	АО «Южно-Уральский завод магниевых соединений» — отчетность 2022	https://e-ecolog.ru/buh/2022/5605021799	Бухгалтерская отчетность ФНС и Росстата	\N	2026-09-09	Строка 2110: выручка за 2022 год — 521 277 тыс. руб.
155	АО «Уральская Сталь» — РСБУ 2022	https://cbonds.ru/company/18741/	Бухгалтерская отчетность РСБУ / финансовая база	\N	2026-09-09	Выручка по РСБУ за 2022 год — 142 737 929 тыс. руб.
156	АО «МЭЗ «Уралэлектро» — бухгалтерская отчетность 2021	https://check.tochka.com/company/1025600752649/	Бухгалтерская отчетность ФНС / аналитический агрегатор	\N	2026-09-09	Выручка АО «МЭЗ «Уралэлектро» за 2021 год — 1 441 165 000 руб.
157	АО «Уральская Сталь» — презентация финансовых результатов	https://fs.moex.com/f/19697/prezentacija-uralstal.pdf	Корпоративная финансовая презентация	\N	2026-09-09	В презентации указана выручка АО «Уральская Сталь» за 2021 год — 142,4 млрд руб.
158	АО «Южно-Уральский завод магниевых соединений» — бухгалтерская отчетность 2021	https://e-ecolog.ru/buh/2021/5605021799	Бухгалтерская отчетность ФНС и Росстата	\N	2026-09-09	Строка 2110: выручка за 2021 год — 503 492 тыс. руб.
159	АО «Оренбургские минералы» — бухгалтерская отчетность 2021	https://e-ecolog.ru/buh/2021/5618000027	Бухгалтерская отчетность ФНС и Росстата	\N	2026-09-09	Строка 2110: выручка за 2021 год — 9 476 522 тыс. руб.
160	ООО «ТЭМЗ» — численность 2021	https://www.openweb.ru/5650005291-ooo-temz	Открытый реестр юридических лиц	\N	2026-09-09	Среднесписочная численность ООО «ТЭМЗ» в 2021 году — 28 сотрудников.
161	ПАО «Гайский ГОК» — финансовые показатели 2021	https://cbonds.ru/stocks/RU000A0B6071/	Бухгалтерская отчетность РСБУ / финансовая база	\N	2026-09-09	Годовая выручка по РСБУ за 2021 год — 44 357 600 тыс. руб.
162	АО «РИФАР» — бухгалтерская отчетность 2021	https://b2b.house/company/AO-RIFAR_f33bf5a7-2d83-4c39-8130-cedce506a278/financial-statements/	Бухгалтерская отчетность ФНС / аналитический агрегатор	\N	2026-09-09	Строка 2110: выручка АО «РИФАР» за 2021 год — 6 561 429 тыс. руб.
163	ООО «ТЭМЗ» — показатели 2021	https://reputation.ru/pfr/office/066253?page=1&year=2021	Аналитический реестр работодателей	\N	2026-09-09	Выручка ООО «ТЭМЗ» за 2021 год — около 296,2 млн руб.
164	ОАО «Переволоцкий элеватор» — показатели 2021	https://www.openweb.ru/5640004644-zao-perevolockaya-melnica	Открытый реестр юридических лиц	\N	2026-09-09	На странице дочерней компании приведена выручка ОАО «Переволоцкий элеватор» за 2021 год — 619 417 000 руб.
165	ПАО «Орскнефтеоргсинтез» — продукция	https://www.ornpz.ru/produkcziya/2024.html	Официальный сайт	\N	2026-09-14	Паспорта качества и перечень нефтепродуктов
166	Южно-Уральский завод магниевых соединений — продукция	https://www.юузмс.рф/	Официальный сайт	\N	2026-09-14	Каталог магниевых соединений
167	АО «Новотроицкий цементный завод» — продукция	https://www.novocement.ru/index.php?Itemid=60&id=67&option=com_content&task=view	Официальный сайт	\N	2026-09-14	Общестроительные, специальные цементы и тампонажные материалы
168	АО «РИФАР» — продукция	https://rifar.ru/products/9/	Официальный сайт	\N	2026-09-14	Каталог радиаторов отопления
169	AKKERMANN CEMENT — продукция	https://akkermann.ru/	Официальный сайт	\N	2026-09-14	Цементная продукция предприятия
170	АО «Новотроицкий завод хромовых соединений» — продукция	https://icatalog.expocentr.ru/ru/exhibitions/348532c1-e716-11ec-80cd-a0d3c1fab97f/exhibitors/294869?stand=23C74	Отраслевой каталог	\N	2026-09-14	Перечень продукции НЗХС
171	АО «Оренбургские минералы» — продукция	https://orenmin.ru/kachestvo/	Официальный сайт	\N	2026-09-14	Информация о хризотиле и нерудных материалах
172	АО «Уральская Сталь» — продукция	https://uralsteel.com/products/	Официальный сайт	\N	2026-09-14	Каталог продукции АО «Уральская Сталь»
173	АО «МЭЗ «Уралэлектро» — низковольтная аппаратура	https://uralelectro.ru/rambo_project/starters-contactors/	Официальный сайт	\N	2026-09-14	Пускатели, контакторы и реле производства Уралэлектро
174	Русагро — масложировой бизнес	https://ar2024.rusagrogroup.ru/ru/performance-overview/combined-oil-fats-business	Корпоративная отчетность	\N	2026-09-14	Маслоэкстракционные предприятия производят растительное масло и шрот
175	АО «Бузулукский механический завод» — продукция	https://www.exponet.ru/exhibitions/online/agroor2017/buzulukskij.ru.html	Отраслевой каталог	\N	2026-09-14	Радиаторы, теплообменники, тракторная и сельскохозяйственная техника
176	АО «МЭЗ «Уралэлектро» — электродвигатели	https://www.uralelectro.ru/wp-content/uploads/%D0%9C%D0%BE%D1%80%D1%81%D0%BA%D0%B8%D0%B5-%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%B4%D0%B2%D0%B8%D0%B3%D0%B0%D1%82%D0%B5%D0%BB%D0%B8-%D1%81%D0%B5%D1%80%D0%B8%D0%B9-%D0%90%D0%94%D0%9C-%D0%9E%D0%9C1-%D0%9E%D0%9C5-%D0%B8-IMM-%D0%9E%D0%9C1-%D0%9E%D0%9C5.pdf	Официальный каталог	\N	2026-09-14	Асинхронные электродвигатели морского исполнения
177	СПК «Птицефабрика Гайская» — официальный сайт	https://www.gayfa.ru/	Официальный сайт	\N	2026-09-26	История предприятия, профиль деятельности и продукция.
178	СПК «Птицефабрика Гайская» — РБК Компании	https://companies.rbc.ru/id/1025600684328-spk-spk-ptitsefabrika-gajskaya/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, статус и финансовые показатели предприятия.
179	ООО «Гаймясопром» — РБК Компании	https://companies.rbc.ru/id/1205600006886-obschestvo-s-ogranichennoj-otvetstvennostyu-radmirzoloto/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД, статус и показатели ООО «Гаймясопром».
180	ООО «Гаймолоко» — РБК Компании	https://companies.rbc.ru/id/1025600682689-ooo-gajmoloko/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД, статус и численность ООО «Гаймолоко».
181	ООО «Хлебный центр» — РБК Компании	https://companies.rbc.ru/id/1135658021872-ooo-hlebnyij-tsentr/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД, численность и финансовые показатели.
182	ООО «Завод «Заряд» — РБК Компании	https://companies.rbc.ru/id/1045601901322-ooo-zavod-zaryad/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД, статус и численность предприятия.
183	ООО «ФермерПродукт» — Точка	https://check.tochka.com/company/1175658014806/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД, статус и финансовые показатели ООО «ФермерПродукт».
184	ООО «ГЗОЦМ «Гайская медь» — перечень производителей медных полуфабрикатов, 2026	https://www.garant.ru/products/ipo/prime/doc/56963485/	Нормативно-справочный источник	2026-08-14	2026-09-26	Подтверждение включения ООО «ГЗОЦМ «Гайская медь» в перечень производителей медных полуфабрикатов.
185	АО «РИФАР» — официальный сайт	https://rifar.ru/company/contacts/	Официальный сайт	\N	2026-09-26	Адрес, контакты и сведения о предприятии в городе Гае.
186	ПАО «Гайский ГОК» — официальный сайт	https://www.ggok.ru/ru/info/for-client/01/	Официальный сайт	2023-09-05	2026-09-26	Реквизиты, адрес и контакты ПАО «Гайский ГОК».
187	ООО «ЮЗСО» — РБК Компании	https://companies.rbc.ru/id/1065607037341-ooo-yuzhno-uralskij-zavod-spasatelnogo-oborudovaniya/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, статус и финансовые показатели ООО «ЮЗСО».
188	ООО «ЮЗСО» — официальный сайт	https://yzso.ru/	Официальный сайт	\N	2026-09-26	Контакты, продукция и год основания предприятия.
189	Гайский муниципальный округ — актуальные коды ОКТМО	https://www.nalog.gov.ru/rn56/taxation/submission_statements/rekvizit/14559470/	ФНС России	2024-12-26	2026-09-26	Изменение статуса Гайского городского округа на Гайский муниципальный округ и код ОКТМО.
190	Гай — географические координаты	https://your-online.ru/coordinates/ru/orenburgskaja-oblast	Географический справочник	\N	2026-09-26	Координаты города Гая: 51.4666, 58.4552.
191	Гайский городской округ — БД показателей муниципальных образований, 2024	https://www.rosstat.gov.ru/scripts/db_inet2/passport/table.aspx?opt=537130002024	Росстат	\N	2026-09-26	Среднемесячная заработная плата работников организаций за 2024 год.
192	ООО «ГЗОЦМ «Гайская медь» — РБК Компании	https://companies.rbc.ru/id/1215600001968-obschestvo-s-ogranichennoj-otvetstvennostyu-gzotsm-gajskaya-med/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, численность и финансовые показатели ООО «ГЗОЦМ «Гайская медь».
193	ООО «ММСК» — РБК Компании	https://companies.rbc.ru/id/1025600752726-ooo-mednogorskij-medno-sernyij-kombinat/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, действующий статус и финансовые показатели ООО «ММСК».
194	АО «МЭЗ «Уралэлектро» — официальный сайт	https://uralelectro.ru/	Официальный сайт	\N	2026-09-26	Профиль производства, история, продукция и контакты предприятия; работает с 1941 года, около 700 сотрудников.
195	ООО «Медногорское карьероуправление» — OpenWeb	https://www.openweb.ru/5606020646-ooo-mku	Данные ЕГРЮЛ	\N	2026-09-26	Реквизиты и статус юридического лица в стадии ликвидации.
196	ООО «Железобетон 2005» — Sledi	https://sledi.ru/zhelezobeton-2005-5614027050/	Данные ЕГРЮЛ и ФНС	\N	2026-09-26	Актуальные на 19.09.2026 реквизиты, действующий статус и сведения о предприятии.
197	ООО «Медногорский пивоваренный завод» — РБК Компании	https://companies.rbc.ru/id/1145658007043-ooo-obschestvo-s-ogranichennoj-otvetstvennostyu-mednogorskij-pivovarennyij-zavod/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД, численность и финансовые показатели за 2024 год.
198	ООО «ОрСнэк» — РБК Компании	https://companies.rbc.ru/id/1115658032566-ooo-orsnek/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, численность, вид деятельности и финансовые показатели.
199	ООО «Промстройкомплект» — РБК Компании	https://companies.rbc.ru/id/1245600003120-ooo-psk/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, основной вид деятельности и финансовые показатели за 2025 год.
200	ООО «МЕДЖБИ» — РБК Компании	https://companies.rbc.ru/id/1225600001923-ooo-mednogorskie-zhelezobetonnyie-izdeliya/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, виды деятельности и финансовые показатели за 2023 год.
201	ООО «БРУ Уралстрой» — РБК Компании	https://companies.rbc.ru/id/1245600003153-ooo-bru-uralstroj/	Данные ЕГРЮЛ	\N	2026-09-26	Реквизиты и виды деятельности производителя товарного бетона.
202	ООО «Новый Ресурс» — РБК Компании	https://companies.rbc.ru/id/1245600006190-ooo-novyij-resurs/	Данные ЕГРЮЛ	\N	2026-09-26	Реквизиты и виды деятельности горнодобывающего предприятия.
203	ООО «Фландерс» — РБК Компании	https://companies.rbc.ru/id/1245600006948-ooo-flanders/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, вид деятельности и финансовые показатели предприятия.
204	Медногорск — население, координаты и ОКТМО	https://www.mojgorod.ru/orenburg_obl/mednogorsk/index.html	Статистический справочник	\N	2026-09-26	Численность населения Медногорска по годам, координаты и код ОКТМО; значения 2021–2023 приведены с округлением.
205	Оренбургстат — муниципальные образования на 1 января 2024 года	https://56.rosstat.gov.ru/storage/document/document_statistic_collection/2024-06/10/%D0%9C%D1%83%D0%BD%D0%B8%D1%86%D0%B8%D0%BF%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%201%20%D1%8F%D0%BD%D0%B2%D0%B0%D1%80%D1%8F%202024%20%D0%B3%D0%BE%D0%B4%D0%B0%281%29.pdf	Официальная статистика Росстата	2024-06-10	2026-09-26	Численность населения города Медногорска на 1 января 2024 года — 23 013 человек.
206	Оренбургстат — муниципальные образования на 1 января 2025 года	https://56.rosstat.gov.ru/storage/document/document_statistic_collection/2025-07/21/%D0%9C%D1%83%D0%BD%D0%B8%D1%86%D0%B8%D0%BF%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%201%20%D1%8F%D0%BD%D0%B2%D0%B0%D1%80%D1%8F%202024%20%D0%B3%D0%BE%D0%B4%D0%B0.pdf	Официальная статистика Росстата	2025-07-21	2026-09-26	Численность городского населения Медногорска на 1 января 2025 года — 22 723 человека.
207	Медногорский медно-серный комбинат — профиль предприятия	https://mmsk.ugmk.com/	Официальный сайт предприятия	\N	2026-09-26	Профиль предприятия и основная продукция: черновая медь, серная кислота и другая металлургическая продукция.
208	АО «Оренбургнефть» — официальный профиль Роснефти	https://www.rosneft.ru/about/Glance/OperationalStructure/Dobicha_i_razrabotka/Centralnaja_Rossija/orenburgneft/	Официальный сайт	\N	2026-09-26	Профиль АО «Оренбургнефть», актуальные сведения о добыче и дочернем ООО «РН-БГПП».
209	АО «Оренбургнефть» — РБК Компании	https://companies.rbc.ru/id/1025601802357-ao-orenburgneft/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД, статус и финансовые показатели АО «Оренбургнефть».
210	ООО «РН-БГПП» — паспорт продукции Роснефти	https://www.rosneft.ru/upload/site1/document_file/PB_Sera_komovaya_BGPP_do_21.03.28.pdf	Официальный документ производителя	\N	2026-09-26	Производитель, адрес и сведения о продукции ООО «РН-БГПП».
211	ООО «РН-БГПП» — РБК Компании	https://companies.rbc.ru/id/1175658018975-ooo-rn-buzulukskoe-gazopererabatyivayuschee-predpriyatie/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, статус, ОКВЭД и численность ООО «РН-БГПП».
212	ООО «Завод Бузулук Гранит» — РБК Компании	https://companies.rbc.ru/id/1185658013320-ooo-zavod-buzuluk-granit/	Данные ЕГРЮЛ	\N	2026-09-26	Реквизиты, адрес, статус и ОКВЭД завода.
213	ООО «Бугурусланский сыродельный завод» — РБК Компании	https://companies.rbc.ru/id/1155658021551-ooo-buguruslanskij-syirodelnyij-zavod/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Правильное наименование, реквизиты, ОКВЭД, численность и показатели за 2025 год.
214	ООО «Бузулукмолоко» — РБК Компании	https://companies.rbc.ru/id/1025600575527-ooo-buzulukmoloko/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, статус, численность и финансовые показатели за 2025 год.
215	ООО «СПР» — официальный сайт	https://buzuluk.spr-prom.ru/o-kompanii/	Официальный сайт	\N	2026-09-26	Производство резинотехнических изделий, контакты и адрес предприятия в Бузулуке.
216	ООО «АСТОН-Поволжье» — официальный сайт	https://buzuluk.aston.ru/	Официальный сайт	\N	2026-09-26	Профиль маслоэкстракционного завода, продукция, мощность и адрес производственной площадки.
217	ООО «АСТОН-Поволжье» — бухгалтерская отчетность 2025	https://b2b.house/company/OOO-ASTON-POVOLZHE_ceac1b8e-5594-4aef-8eff-13de985fcfab/financial-statements/	Бухгалтерская отчетность ФНС	\N	2026-09-26	Выручка и чистая прибыль предприятия за 2025 год.
218	АО «Композит Групп» — РБК Компании	https://companies.rbc.ru/id/1025600577496-ao-buzulukskij-mehanicheskij-zavod/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Актуальное юридическое наименование бывшего Бузулукского механического завода, реквизиты и показатели за 2025 год.
219	ООО «Экономия» — РБК Компании	https://companies.rbc.ru/id/1025600578332-ooo-ekonomiya/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД, численность и финансовые показатели производителя кирпича.
220	ООО «Заготовитель» — РБК Компании	https://companies.rbc.ru/id/1045613150494-ooo-zagotovitel/	Данные ЕГРЮЛ	\N	2026-09-26	Реквизиты, ОКВЭД, статус и численность мясоперерабатывающего предприятия.
221	ООО «ПК Альянс» — РБК Компании	https://companies.rbc.ru/id/1215600001792-obschestvo-s-ogranichennoj-otvetstvennostyu-proizvodstvennaya-kompaniya-alyans/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД и финансовые показатели производителя напитков.
222	ООО «Стройаэрокуб» — РБК Компании	https://companies.rbc.ru/id/1255600001964-ooo-strojaerokub/	Данные ЕГРЮЛ	\N	2026-09-26	Реквизиты и производственный профиль нового предприятия строительных материалов.
223	ООО «Бузулукский ликероводочный завод» — РБК Компании	https://companies.rbc.ru/id/1155658017987-ooo-buzulukskij-likerovodochnyij-zavod/	Данные ЕГРЮЛ	\N	2026-09-26	Реквизиты, профиль предприятия и решение ФНС о ликвидации.
224	ООО «Бузулукское молоко» — B2B.House	https://b2b.house/company/OOO-BUZULUKSKOE-MOLOKO_8910c753-60be-4a1d-8d35-2c1301ee5fab/	Данные ФНС и бухгалтерской отчетности	\N	2026-09-26	Выручка, прибыль, численность и расчетная средняя зарплата за 2021–2025 годы.
225	ООО «Бузулукское молоко» — РБК Компании	https://companies.rbc.ru/id/1065603033429-ooo-buzulukskoe-moloko/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, профиль и финансовые показатели крупного молочного предприятия.
226	ООО «ТМК НГС-Бузулук» — официальный сайт ТМК	https://tmk-ngs.tmk-group.ru/tmk_ngs_contacts	Официальный сайт	\N	2026-09-26	Адрес, телефон и электронная почта ООО «ТМК НГС-Бузулук».
227	ООО «ТМК НГС-Бузулук» — РБК Компании	https://companies.rbc.ru/id/1025600575660-ooo-tmk-neftegazservis-buzuluk/	Данные ЕГРЮЛ и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, ОКВЭД и финансовые показатели за 2025 год.
228	ООО «ТМК НГС-Бузулук» — сведения о численности	https://site.birweb.1prime.ru/company-brief/4101826	Данные ФНС / аналитический агрегатор	\N	2026-09-26	Численность 477 сотрудников и выручка за 2025 год.
229	ООО «Горторг» — Companium	https://companium.ru/id/1045601154906-gortorg	Данные ФНС и бухгалтерской отчетности	\N	2026-09-26	Реквизиты, финансовые показатели и численность мясоперерабатывающего предприятия.
230	ООО «Горторг-Д» — Фирмотека	https://firmoteka.ru/5603015060	Данные ФНС и бухгалтерской отчетности	\N	2026-09-26	ОКВЭД, выручка, прибыль и численность производителя макаронных изделий за 2025 год.
231	Оренбургстат — муниципальные образования на 1 января 2021 года	https://56.rosstat.gov.ru/storage/document/document_statistic_collection/2021-06/11/%D0%9C%D1%83%D0%BD%D0%B8%D1%86%D0%B8%D0%BF%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%201%20%D1%8F%D0%BD%D0%B2%D0%B0%D1%80%D1%8F%202021%20%D0%B3%D0%BE%D0%B4%D0%B0.pdf	Официальная статистика Росстата	2021-06-11	2026-09-26	Численность населения городского округа город Бузулук на 1 января 2021 года — 86 042 человека.
232	Оренбургстат — численность населения муниципальных образований 2022–2023	https://56.rosstat.gov.ru/storage/mediabank/%D0%A0%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%204.%D0%A1%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BD%D0%B0%D1%81%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B8%20%D0%B7%D0%B4%D1%80%D0%B0%D0%B2%D0%BE%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F.pdf	Официальная статистика Росстата	\N	2026-09-26	Численность населения Бузулука: 88 250 человек на 01.01.2022 и 88 419 человек на 01.01.2023.
233	Бузулук — динамика численности населения	https://www.mojgorod.ru/orenburg_obl/buzuluk/index.html	Статистический справочник	\N	2026-09-26	Динамика населения города, включая 2024 год; значение приведено с округлением.
234	Оренбургстат — муниципальные образования на 1 января 2025 года	https://56.rosstat.gov.ru/storage/document/document_statistic_collection/2025-07/21/%D0%9C%D1%83%D0%BD%D0%B8%D1%86%D0%B8%D0%BF%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%201%20%D1%8F%D0%BD%D0%B2%D0%B0%D1%80%D1%8F%202024%20%D0%B3%D0%BE%D0%B4%D0%B0.pdf	Официальная статистика Росстата	2025-07-21	2026-09-26	Численность населения городского округа город Бузулук на 1 января 2025 года — 88 202 человека.
235	Бузулук — координаты	https://www.geodatos.net/en/coordinates/russia/buzuluk	Географический справочник	\N	2026-09-26	Координаты города Бузулука.
236	Бузулук — ОКТМО	https://classinform.ru/oktmo/53712000000.html	Классификатор ОКТМО	\N	2026-09-26	Код ОКТМО городского округа и населенного пункта Бузулук.
237	Инвестиционная декларация Оренбургской области — проекты в Бузулуке	https://www.orenb-gov.ru/doc/89242	Нормативный акт Оренбургской области	2022-04-15	2026-09-26	Инвестиционные проекты АСТОН-Поволжье и комплекса глубокой переработки масличных культур в Бузулуке.
\.


--
-- Data for Name: enterprise_metrics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.enterprise_metrics (id, enterprise_id, year, employees, revenue, investments, average_salary, source_id, net_profit, assets, taxes_paid, production_volume) FROM stdin;
1	1	2025	\N	105455000000	\N	\N	105	\N	\N	\N	\N
2	9	2025	1412	6776000000	\N	\N	105	\N	\N	\N	\N
3	2	2025	147	3517000000	\N	\N	105	\N	\N	\N	\N
4	14	2025	\N	30484883000	\N	\N	106	\N	\N	\N	\N
5	11	2025	\N	9354000000	\N	\N	105	\N	\N	\N	\N
6	19	2025	796	6179000000	\N	\N	105	\N	\N	\N	\N
7	74	2025	\N	111248000000	\N	\N	105	\N	\N	\N	\N
8	87	2025	13	9694000000	\N	\N	105	\N	\N	\N	\N
9	53	2025	\N	44061425000	\N	\N	108	\N	\N	\N	\N
10	70	2025	876	6127359000	\N	\N	110	\N	\N	\N	\N
11	57	2025	1786	8876726000	\N	\N	104	\N	\N	\N	\N
12	97	2025	258	6249000000	\N	\N	105	\N	\N	\N	\N
13	61	2025	127	27586658000	\N	\N	111	\N	\N	\N	\N
14	72	2025	\N	10613090000	\N	\N	107	\N	\N	\N	\N
15	65	2025	\N	87516000	\N	\N	62	\N	\N	\N	\N
16	64	2025	76	202217000	\N	\N	101	\N	\N	\N	\N
17	147	2025	136	606701000	\N	\N	103	\N	\N	\N	\N
18	63	2025	\N	349813000	\N	\N	100	\N	\N	\N	\N
19	152	2025	\N	604130000	\N	\N	109	\N	\N	\N	\N
20	143	2025	\N	24090000	\N	\N	98	\N	\N	\N	\N
21	59	2025	171	261329000	\N	\N	99	\N	\N	\N	\N
22	56	2025	\N	1669991000	\N	\N	102	\N	\N	\N	\N
23	1	2024	9231	153749457000	\N	\N	129	\N	\N	\N	\N
24	9	2024	1473	5789017000	\N	82986.08	122	\N	\N	\N	\N
25	2	2024	154	2807055000	\N	\N	112	\N	\N	\N	\N
26	14	2024	\N	24176919000	\N	\N	117	\N	\N	\N	\N
27	11	2024	\N	8457293000	\N	\N	119	\N	\N	\N	\N
28	19	2024	554	2947832000	\N	\N	124	\N	\N	\N	\N
29	74	2024	\N	142851034000	\N	\N	118	\N	\N	\N	\N
30	53	2024	\N	44013349000	\N	\N	123	\N	\N	\N	\N
31	70	2024	999	7421967000	\N	\N	110	\N	\N	\N	\N
32	57	2024	1771	9128454000	\N	88671.47	121	\N	\N	\N	\N
33	97	2024	49	1480031000	\N	\N	128	\N	\N	\N	\N
34	61	2024	\N	12295653000	\N	\N	127	\N	\N	\N	\N
35	72	2024	\N	15426817000	\N	\N	126	\N	\N	\N	\N
36	65	2024	41	88232000	\N	\N	125	\N	\N	\N	\N
37	64	2024	39	47074000	\N	\N	101	\N	\N	\N	\N
38	147	2024	138	442778000	\N	\N	116	\N	\N	\N	\N
39	63	2024	35	412512000	\N	\N	120	\N	\N	\N	\N
40	152	2024	80	655360000	\N	\N	87	\N	\N	\N	\N
41	143	2024	\N	30017000	\N	\N	92	\N	\N	\N	\N
42	59	2024	202	538423000	\N	\N	99	\N	\N	\N	\N
43	56	2024	\N	1699882000	\N	\N	114	\N	\N	\N	\N
44	1	2023	\N	161787841000	\N	\N	131	\N	\N	\N	\N
45	9	2023	\N	5059405000	\N	\N	115	\N	\N	\N	\N
46	14	2023	\N	22832486000	\N	\N	117	\N	\N	\N	\N
47	11	2023	\N	7001608000	\N	\N	119	\N	\N	\N	\N
48	19	2023	\N	2797202000	\N	\N	130	\N	\N	\N	\N
49	74	2023	\N	125170259000	\N	\N	138	\N	\N	\N	\N
50	76	2023	\N	85841631000	\N	\N	137	\N	\N	\N	\N
51	53	2023	\N	40900204000	\N	\N	123	\N	\N	\N	\N
52	70	2023	\N	6724520000	\N	\N	136	\N	\N	\N	\N
53	57	2023	1840	7726363000	\N	\N	133	\N	\N	\N	\N
54	72	2023	\N	13561457000	\N	\N	132	\N	\N	\N	\N
55	64	2023	\N	34270000	\N	\N	101	\N	\N	\N	\N
56	147	2023	\N	337182000	\N	\N	75	\N	\N	\N	\N
57	152	2023	\N	496309000	\N	\N	87	\N	\N	\N	\N
58	143	2023	\N	28836000	\N	\N	92	\N	\N	\N	\N
59	59	2023	\N	410605000	\N	\N	135	\N	\N	\N	\N
60	56	2023	\N	1625431000	\N	\N	114	\N	\N	\N	\N
61	64	2022	\N	2910000	\N	\N	101	\N	\N	\N	\N
62	14	2022	\N	21281934000	\N	\N	117	\N	\N	\N	\N
63	70	2022	\N	6737368000	\N	\N	149	\N	\N	\N	\N
64	19	2022	\N	1710000000	\N	\N	139	\N	\N	\N	\N
65	9	2022	\N	3579291000	\N	\N	140	\N	\N	\N	\N
66	61	2022	\N	5615518000	\N	\N	141	\N	\N	\N	\N
67	147	2022	\N	246529000	\N	\N	142	\N	\N	\N	\N
68	152	2022	\N	638300000	\N	\N	143	\N	\N	\N	\N
69	65	2022	\N	66812000	\N	\N	144	\N	\N	\N	\N
70	143	2022	\N	28696000	\N	\N	145	\N	\N	\N	\N
71	56	2022	\N	1500000000	\N	\N	146	\N	\N	\N	\N
72	53	2022	\N	41334374000	\N	\N	147	\N	\N	\N	\N
73	57	2022	\N	6752232000	\N	\N	148	\N	\N	\N	\N
74	72	2022	\N	12339628000	\N	\N	150	\N	\N	\N	\N
75	74	2022	\N	123600000000	\N	\N	151	\N	\N	\N	\N
76	76	2022	\N	84730000000	\N	\N	152	\N	\N	\N	\N
77	11	2022	\N	6068075000	\N	\N	153	\N	\N	\N	\N
78	59	2022	\N	521277000	\N	\N	154	\N	\N	\N	\N
79	1	2022	\N	142737929000	\N	\N	155	\N	\N	\N	\N
80	14	2021	\N	14279567000	\N	\N	117	\N	\N	\N	\N
81	74	2021	\N	102690156000	\N	\N	118	\N	\N	\N	\N
82	19	2021	\N	934370000	\N	\N	139	\N	\N	\N	\N
83	9	2021	\N	1858232000	\N	\N	140	\N	\N	\N	\N
84	147	2021	\N	167590000	\N	\N	142	\N	\N	\N	\N
85	143	2021	\N	22890000	\N	\N	145	\N	\N	\N	\N
86	72	2021	\N	11939620000	\N	\N	150	\N	\N	\N	\N
87	11	2021	\N	5727482000	\N	\N	153	\N	\N	\N	\N
88	56	2021	\N	1441165000	\N	\N	156	\N	\N	\N	\N
89	1	2021	\N	142400000000	\N	\N	157	\N	\N	\N	\N
90	59	2021	\N	503492000	\N	\N	158	\N	\N	\N	\N
91	57	2021	\N	9476522000	\N	\N	159	\N	\N	\N	\N
92	53	2021	\N	44357600000	\N	\N	161	\N	\N	\N	\N
93	70	2021	\N	6561429000	\N	\N	162	\N	\N	\N	\N
94	63	2021	28	296200000	\N	\N	163	\N	\N	\N	\N
95	152	2021	\N	619417000	\N	\N	164	\N	\N	\N	\N
96	77	2024	\N	1110771000	\N	\N	187	17259000	1044151000	\N	\N
97	54	2021	\N	2166130000	\N	\N	192	37344000	\N	\N	\N
98	153	2025	\N	1755717000	\N	\N	178	\N	\N	\N	\N
99	154	2025	\N	329000	\N	\N	179	-3056000	\N	\N	\N
100	156	2025	3	43038000	\N	\N	181	81000	\N	\N	\N
101	157	2025	1	\N	\N	\N	182	\N	\N	\N	\N
102	155	2025	2	\N	\N	\N	180	\N	\N	\N	\N
103	158	2024	\N	52069000	\N	\N	183	8717000	\N	\N	\N
104	55	2023	\N	7679634000	\N	\N	193	-2468113000	9455294000	\N	\N
105	100	2024	18	32290000	\N	\N	197	-2988000	\N	\N	\N
106	159	2023	\N	1342000	\N	\N	198	25000	\N	\N	\N
107	160	2025	\N	68000	\N	\N	199	-237000	\N	\N	\N
108	161	2023	\N	15209000	\N	\N	200	618000	\N	\N	\N
109	164	2024	\N	1112000	\N	\N	203	-1352000	\N	\N	\N
110	68	2021	\N	324262035000	\N	\N	209	68427926000	654942676000	\N	\N
111	62	2025	93	1277170000	\N	\N	218	-19209000	\N	\N	\N
112	94	2025	1	2692000	\N	\N	213	23000	1932000	\N	\N
113	95	2025	10	70522000	\N	\N	214	583000	68101000	\N	\N
114	166	2025	10	5363000	\N	\N	219	-1317000	15054000	\N	\N
115	168	2025	\N	2002000	\N	\N	221	1000	\N	\N	\N
116	171	2021	440	1420000000	\N	27551.70	224	48820000	\N	\N	\N
117	171	2022	416	1540000000	\N	31756.41	224	64190000	\N	\N	\N
118	171	2023	416	1647569000	\N	38235.58	224	126320000	\N	\N	\N
119	171	2024	453	2016194000	\N	44115.53	224	110736000	\N	\N	\N
120	171	2025	467	2353458000	\N	54271.77	224	91330000	\N	\N	\N
121	172	2025	477	1564250000	\N	\N	228	-203091000	\N	\N	\N
122	173	2025	244	762700000	\N	\N	229	2500000	\N	\N	\N
123	174	2025	98	145282000	\N	\N	230	22176000	\N	\N	\N
\.


--
-- Data for Name: enterprise_products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.enterprise_products (id, enterprise_id, product_name, product_category, description, is_main, source_id) FROM stdin;
1	9	Керамические пропанты	Нефтегазовая промышленность	Керамические расклинивающие материалы для гидроразрыва пласта	t	3
2	14	Автомобильный бензин АИ-92	Нефтепродукты	Автомобильный бензин экологических классов К4 и К5	t	165
3	14	Автомобильный бензин АИ-95	Нефтепродукты	Автомобильный бензин экологического класса К5	t	165
4	14	Дизельное топливо Евро	Нефтепродукты	Дизельное топливо экологического класса К5	t	165
5	14	Дорожный нефтяной битум	Нефтепродукты	Битумы для дорожного строительства	f	165
6	14	Топливо для реактивных двигателей РТ	Нефтепродукты	Авиационное реактивное топливо	f	165
7	14	Сера техническая	Промышленная химия	Техническая сера, получаемая при нефтепереработке	f	165
8	59	Сульфат магния семиводный	Промышленная химия	MgSO4·7H2O	t	166
9	59	Минеральные удобрения	Агрохимия	Магнийсодержащие удобрения для растений	t	166
10	59	Кормовые добавки	Кормовые компоненты	Минеральные кормовые добавки	f	166
11	59	Английская соль	Магниевые соединения	Сульфат магния	f	166
12	6	Общестроительный цемент	Строительные материалы	Цемент общестроительного назначения	t	167
13	6	Специальный цемент	Строительные материалы	Специальные марки цемента	t	167
14	6	Тампонажные материалы	Строительные материалы	Материалы для цементирования нефтегазовых скважин	f	167
15	70	Биметаллические секционные радиаторы	Отопительное оборудование	Секционные биметаллические радиаторы отопления	t	168
16	70	Монолитные биметаллические радиаторы	Отопительное оборудование	Монолитные биметаллические радиаторы	t	168
17	70	Алюминиевые секционные радиаторы	Отопительное оборудование	Алюминиевые радиаторы отопления	t	168
18	70	Радиаторы специального исполнения	Отопительное оборудование	Радиаторы с нижним подключением и специальной геометрией	f	168
19	4	Навальный цемент	Строительные материалы	Цемент промышленной отгрузки	t	169
20	4	Тарированный цемент	Строительные материалы	Цемент в мешках	t	169
21	4	Цемент М500	Строительные материалы	Цемент марки М500	t	169
22	4	Цемент М600	Строительные материалы	Цемент повышенной прочности	f	169
23	7	Хромовый ангидрид	Химическая продукция	Технический хромовый ангидрид	t	170
24	7	Бихромат натрия	Химическая продукция	Соединение шестивалентного хрома	t	170
25	7	Окись хрома	Химическая продукция	Зеленая окись хрома	t	170
26	7	Металлический хром	Металлургическая продукция	Металлический хром	f	170
27	7	Бихромат калия	Химическая продукция	Калий двухромовокислый	f	170
28	57	Хризотил	Минеральное сырье	Хризотил 3–7 групп	t	171
29	57	Щебень	Нерудные строительные материалы	Щебень смеси различных фракций	t	171
30	57	Песчано-щебеночная смесь	Нерудные строительные материалы	ПЩС, получаемая при переработке минерального сырья	f	171
31	57	Гранитный отсев	Нерудные строительные материалы	Крупнозернистая каменная посыпка	f	171
32	57	Гидросиликат магния	Минеральная продукция	Минеральный продукт переработки	f	171
33	1	Мостовая сталь	Металлургическая продукция	Сталь для мостостроения и металлоконструкций	t	172
34	1	Листовой прокат	Металлопрокат	Стальной листовой прокат промышленного назначения	t	172
35	1	Высокопрочная сталь WeldUS 690	Специальные стали	Высокопрочная свариваемая сталь	f	172
36	1	Износостойкая сталь HardUS 450	Специальные стали	Высокопрочная износостойкая сталь	f	172
37	61	Нерафинированное растительное масло	Масложировая продукция	Растительное масло, получаемое при переработке масличных культур	t	68
38	61	Подсолнечное масло	Масложировая продукция	Масло из семян подсолнечника	t	174
39	61	Подсолнечный шрот	Кормовая продукция	Высокобелковый продукт переработки семян подсолнечника	t	174
40	72	Нефть сырая	Нефтедобыча	Нефть, добываемая на Байтуганском нефтяном месторождении	t	150
41	72	Разработка нефтяных месторождений	Нефтедобыча	Разработка углеводородных залежей Байтуганского нефтяного месторождения	f	150
42	62	Радиаторы охлаждения	Автокомпоненты	Радиаторы для автомобильной, тракторной и специальной техники	t	175
43	62	Теплообменники	Автокомпоненты	Масляные и водяные теплообменные устройства	t	175
44	62	Тракторы «Беларус»	Сельскохозяйственная техника	Сборка тракторной техники МТЗ	t	175
45	62	Сельскохозяйственная техника	Машиностроительная продукция	Прицепное, навесное и сельскохозяйственное оборудование	f	175
46	56	Асинхронные электродвигатели	Электротехническое оборудование	Асинхронные электрические двигатели промышленного назначения	t	176
47	56	Электродвигатели морского исполнения	Электротехническое оборудование	Электродвигатели серий АДМ и IMM морского исполнения	t	176
48	56	Магнитные пускатели	Низковольтная аппаратура	Электромагнитные и магнитные пускатели различных серий	t	173
49	56	Электромагнитные контакторы	Низковольтная аппаратура	Контакторы общепромышленного и специального назначения	t	173
50	56	Электротепловые реле	Низковольтная аппаратура	Токовые электротепловые реле защиты	f	173
51	147	Деповской ремонт грузовых вагонов	Ремонт железнодорожного транспорта	Деповской ремонт различных типов грузовых вагонов	t	74
52	147	Капитальный ремонт грузовых вагонов	Ремонт железнодорожного транспорта	Капитальный ремонт грузового подвижного состава	t	74
53	147	Текущий отцепочный ремонт	Ремонт железнодорожного транспорта	Текущий ремонт грузовых вагонов	t	74
54	147	Ремонт колесных пар	Ремонт железнодорожного оборудования	Техническое обслуживание и ремонт колесных пар грузовых вагонов	f	74
55	147	Ремонт вагонных тележек	Ремонт железнодорожного оборудования	Ремонт тележек грузовых вагонов	f	74
56	147	Ремонт автосцепных устройств	Ремонт железнодорожного оборудования	Проверка и ремонт деталей автосцепного устройства	f	74
57	53	Медный концентрат	Горнорудное сырьё	Медный концентрат, получаемый при переработке медно-колчеданных руд.	t	186
58	53	Цинковый концентрат	Горнорудное сырьё	Цинковый концентрат.	t	186
59	53	Пиритный концентрат	Горнорудное сырьё	Пиритный концентрат.	t	186
60	54	Медный прокат	Цветной металлопрокат	Плоский прокат из меди.	t	184
61	54	Латунный прокат	Цветной металлопрокат	Плоский прокат из латуни.	t	184
62	54	Медно-никелевый и никелевый прокат	Цветной металлопрокат	Прокат из медно-никелевых сплавов и никеля.	t	184
63	77	Шахтные изолирующие самоспасатели	Средства индивидуальной защиты	Самоспасатели для аварийной эвакуации в шахтах.	t	188
64	77	Пожарные изолирующие самоспасатели	Средства индивидуальной защиты	Самоспасатели для эвакуации при пожарах.	t	188
65	77	Изолирующие регенеративные респираторы	Спасательное оборудование	Регенеративные дыхательные аппараты.	t	188
66	153	Куриное яйцо	Продукция птицеводства	Пищевое куриное яйцо.	t	177
67	153	Мясо птицы и полуфабрикаты	Мясная продукция	Мясо птицы, фарши, субпродукты и полуфабрикаты.	t	177
68	153	Колбасные изделия и деликатесы	Мясная переработка	Колбасные изделия и мясные деликатесы.	f	177
69	154	Мясные полуфабрикаты	Мясная продукция	Мясные и мясосодержащие полуфабрикаты.	t	179
70	155	Молоко и молочная продукция	Молочная продукция	Молоко и продукты его переработки.	t	180
71	156	Хлеб и мучные кондитерские изделия	Хлебобулочная продукция	Хлеб, хлебобулочные и мучные кондитерские изделия.	t	181
72	157	Электрические аккумуляторы и аккумуляторные батареи	Электротехническая продукция	Аккумуляторы и аккумуляторные батареи.	t	182
73	158	Мясо и мясные продукты	Мясная продукция	Продукция переработки и консервирования мяса.	t	183
74	55	Черновая медь	Цветная металлургия	Основная металлургическая продукция ММСК.	t	207
75	55	Серная кислота	Химическая продукция	Серная кислота, получаемая при утилизации металлургических газов.	t	207
76	55	Цинк сернокислый в растворе	Химическая продукция	Сульфат цинка в растворе.	f	207
77	98	Щебень	Нерудные строительные материалы	Щебень и другие материалы карьерной разработки.	t	195
78	99	Железобетонные изделия	Строительные материалы	Изделия из бетона для использования в строительстве.	t	196
79	100	Пиво	Напитки	Пиво собственного производства.	t	197
80	100	Безалкогольные напитки	Напитки	Безалкогольные ароматизированные напитки.	f	197
81	100	Упакованная питьевая вода	Напитки	Упакованная питьевая вода.	f	197
82	159	Сухари, печенье и кондитерские изделия	Хлебобулочная и кондитерская продукция	Сухари, печенье и мучные кондитерские изделия длительного хранения.	t	198
83	160	Изделия из бетона, цемента и гипса	Строительные материалы	Строительные изделия из минеральных материалов.	t	199
84	161	Товарный бетон	Строительные материалы	Бетонные смеси для строительных работ.	t	200
85	161	Железобетонные изделия	Строительные материалы	Изделия из бетона для использования в строительстве.	f	200
86	162	Товарный бетон	Строительные материалы	Товарный бетон.	t	201
87	162	Бетонные и железобетонные изделия	Строительные материалы	Изделия из бетона для строительного применения.	f	201
88	163	Никелевая и кобальтовая руда	Рудное сырьё	Руды никеля и кобальта и продукты их обогащения.	t	202
89	164	Пиво	Напитки	Пиво собственного производства.	t	203
90	164	Прочие напитки	Напитки	Напитки, выпускаемые в рамках зарегистрированных видов деятельности.	f	203
91	68	Нефть	Углеводородное сырьё	Добываемая нефть.	t	208
92	68	Нефтяной газ	Углеводородное сырьё	Попутный нефтяной газ и другое нефтегазовое сырьё.	f	208
93	93	Изделия из гранита и природного камня	Строительные материалы	Резка, обработка и отделка природного камня.	t	212
94	94	Сыр и сырные продукты	Молочная продукция	Сыр и другая продукция переработки молока.	t	213
95	95	Молоко и молочная продукция	Молочная продукция	Питьевое молоко и молочная продукция.	t	214
96	96	Резинотехнические уплотнения	Резинотехнические изделия	Уплотнения, манжеты, кольца и изделия из NBR, FKM, EPDM, силикона, полиуретана и фторопласта.	t	215
97	97	Растительное масло	Масложировая продукция	Растительное масло из семян подсолнечника.	t	216
98	97	Высокопротеиновый подсолнечный шрот	Кормовая продукция	Высокопротеиновый кормовой шрот.	t	216
99	165	Сжиженные углеводородные газы	Нефтегазохимическая продукция	Пропан-бутановые и иные сжиженные углеводородные газы.	t	210
100	165	Газовая сера	Нефтегазохимическая продукция	Комовая газовая сера.	t	210
101	166	Кирпич и керамические строительные изделия	Строительные материалы	Изделия из обожженной глины для строительства.	t	219
102	167	Охлажденное мясо	Мясная продукция	Мясо в охлажденном виде.	t	220
103	167	Мясные субпродукты	Мясная продукция	Охлажденные и замороженные пищевые субпродукты.	f	220
104	168	Безалкогольные напитки и питьевая вода	Напитки	Безалкогольные напитки и упакованные питьевые воды, включая минеральные.	t	221
105	169	Бетонные изделия	Строительные материалы	Изделия из бетона для использования в строительстве.	t	222
106	170	Ликероводочная продукция	Напитки	Дистиллированные алкогольные напитки.	t	223
107	171	Молочная продукция	Молочная продукция	Молоко, сливки, масло и иные продукты переработки молока.	t	225
108	171	Сыр и сырные продукты	Молочная продукция	Сыры и сырные продукты.	f	225
109	172	Нефтегазосервис и ремонт трубной продукции	Промышленные услуги	Обслуживание нефтегазового оборудования, трубной продукции и металлообработка.	t	227
110	173	Колбасные изделия и мясные полуфабрикаты	Мясная продукция	Продукция из мяса убойных животных и мяса птицы.	t	229
111	174	Макаронные изделия	Макаронная продукция	Макаронные изделия промышленного производства.	t	230
\.


--
-- Data for Name: enterprise_sources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.enterprise_sources (id, enterprise_id, source_id, source_role, notes) FROM stdin;
1	58	9	Юридические сведения	Раскрытие информации эмитента за 2026 год
2	58	10	Основной источник	Официальный сайт предприятия
3	59	7	Основной источник	Официальный сайт, продукция и новости 2026
4	60	8	Основной источник	Официальный сайт и реквизиты
5	101	17	Юридические сведения	Юридическое лицо действует; производство исторически остановлено
6	102	16	Подтверждение производства	Декларация соответствия продукции 28.08.2026
7	102	13	Юридические сведения	Реквизиты и статус
8	103	18	Юридические сведения	ИНН, ОГРН, адрес, статус
9	103	14	Основной источник	Официальный сайт предприятия
10	104	19	Юридические сведения	Реквизиты и статус
11	105	12	Основной источник	Производственная площадка в Кувандыке
12	106	11	Официальное подтверждение	Ростехнадзор, объекты предприятия в графике 2026
13	107	15	Юридические сведения	Реквизиты и деятельность предприятия
14	112	23	Юридические сведения	ИНН, ОГРН, адрес, ОКВЭД и действующий статус
15	108	22	Основной источник	Официальная страница производственной площадки в Соль-Илецке
16	110	26	Основной источник	Официальный сайт элеваторного комплекса
17	114	25	Исторический источник	Реквизиты и дата ликвидации
18	109	27	Юридические сведения	Реквизиты, адрес, ОКВЭД и статус
19	108	28	Юридические сведения	Реквизиты, ОКВЭД и статус ООО «Руссоль»
20	113	29	Исторический источник	Реквизиты и дата ликвидации
21	109	20	Производственный профиль	Специализация, продукция и контакты
22	110	30	Юридические сведения	ИНН, ОГРН, адрес и действующий статус
23	115	31	Исторический источник	Реквизиты, профиль деятельности и дата ликвидации
24	111	21	Юридические сведения	ИНН, ОГРН, адрес, ОКВЭД и действующий статус
25	57	40	Основной источник	Официальный сайт предприятия
26	57	36	Контакты и реквизиты	Официальные реквизиты
27	57	37	Юридические сведения	ОКВЭД и статус
28	116	58	Юридические сведения	Реквизиты и статус
29	116	41	Подтверждение производства	Работа завода в 2025 году
30	117	44	Юридические сведения	Реквизиты и статус
31	117	49	Производственный профиль	Мягкая промышленная упаковка
32	118	55	Юридические сведения	Реквизиты и статус
33	118	42	Актуальность производства	Хризопро и экспортные переговоры 2026
34	119	60	Юридические сведения	Реквизиты, профиль и статус
35	120	52	Юридические сведения	Реквизиты и статус
36	120	45	Подтверждение производства	Швейное производство в 2025 году
37	121	34	Основной источник	Производственная площадка в Ясном и контакты
38	122	51	Юридические сведения	Реквизиты, ОКВЭД и статус
39	123	33	Основной источник	Официальный сайт, продукция и контакты
40	123	46	Юридические сведения	ИНН, ОГРН и ОКВЭД
41	124	32	Юридические сведения	Реквизиты, ОКВЭД 20.51 и статус
42	125	43	Юридические сведения	Реквизиты, ОКВЭД и статус
43	126	56	Юридические сведения	Реквизиты, ОКВЭД и статус
44	127	50	Юридические сведения	Статус и реквизиты на 2026 год
45	128	59	Юридические сведения	Статус и реквизиты на 2026 год
46	129	47	Юридические сведения	Энергетическое предприятие, статус на 2026 год
47	130	61	Юридические сведения	Энергетическое предприятие, статус на 2026 год
48	131	48	Юридические сведения	Реквизиты и ОКВЭД
49	131	39	Инвестиционный проект	Более 70 млн руб., 28 рабочих мест, ввод производства в 2027 году
50	132	53	Статус предприятия	Банкротство и реквизиты
51	133	38	Статус предприятия	Процесс ликвидации в 2026 году
52	134	35	Исторический источник	Ликвидированное добывающее предприятие
53	72	64	Юридические сведения	ФНС: действующий статус, реквизиты и ОКВЭД
54	139	65	Юридические сведения	Реквизиты и статус
55	65	62	Юридические сведения	Реквизиты и ОКВЭД
56	65	63	Актуальность производства	Подтверждение работы предприятия в 2026 году
57	138	66	Основной источник	Официальные реквизиты и контакты
58	138	67	Юридические сведения	ОКВЭД и действующий статус
59	61	68	Основной источник	Федеральный ресурс по производительности труда
60	61	69	Юридические сведения	ОГРН, адрес и статус
61	137	70	Основной источник	Федеральный ресурс по производительности труда
62	137	71	Юридические сведения	ОГРН, адрес и статус
63	136	72	Исторический источник	Прекращение деятельности КХП
64	135	73	Исторический источник	Ликвидированный мясокомбинат
65	147	74	Основной источник	Официальный сайт вагоноремонтного предприятия
66	147	75	Юридические сведения	Реквизиты и численность
67	146	76	Юридические сведения	Действующий статус и ОКВЭД
68	145	77	Статус предприятия	Предстоящее исключение из ЕГРЮЛ
69	64	78	Инвестиционный источник	Реализованный проект на 1,3 млрд руб. и 80 рабочих мест
70	64	79	Юридические сведения	Реквизиты и статус
71	149	80	Юридические сведения	Реквизиты эмитента
72	149	81	Статус производственной деятельности	Судебное подтверждение прекращения основной деятельности
73	148	82	Юридические сведения	Действующее энергетическое предприятие
74	63	83	Основной источник	Официальный сайт ТЭМЗ
75	150	84	Официальное подтверждение	Действующая лицензия в 2026 году
76	150	85	Юридические сведения	Реквизиты и виды деятельности
77	152	86	Основной источник	Официальный сайт и продукция
78	152	87	Юридические сведения	Реквизиты и статус
79	151	88	Официальный региональный источник	Производство паровых котлов и блочно-модульных котельных
80	151	89	Юридические сведения	ИНН, ОГРН и адрес
81	144	90	Основной источник	Официальная производственная площадка и контакты
82	144	91	Юридические сведения	ИНН, ОГРН и производственный профиль
83	143	92	Юридические сведения	Реквизиты, ОКВЭД и статус
84	143	93	Основной источник	Отраслевое подтверждение предприятия и контакты
85	142	94	Исторический источник	Дата ликвидации молочного завода
86	141	95	Юридические сведения	Новое действующее предприятие 2026 года
87	140	96	Исторический источник	Ликвидация предприятия после банкротства
88	140	97	Инвестиционный источник	Историческая карточка проекта завода тонкодисперсного мела
89	53	186	Официальный источник	Реквизиты и контакты предприятия.
90	70	185	Официальный источник	Адрес, контакты и профиль предприятия.
91	54	184	Актуальный статус производителя	Предприятие включено в перечень производителей медных полуфабрикатов.
92	77	188	Официальный источник	Продукция, контакты и год основания.
93	153	177	Официальный источник	История, производство и продукция.
94	154	179	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД, статус и финансовые показатели.
95	155	180	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД, статус и численность.
96	156	181	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД, численность и финансовые показатели.
97	157	182	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД, статус и численность.
98	158	183	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД, статус и финансовые показатели.
99	54	192	Финансовые показатели	Финансовая отчетность и численность предприятия.
100	55	193	Реквизиты и показатели	Действующий статус и бухгалтерская отчетность.
101	55	207	Официальный источник	Профиль предприятия и продукция.
102	56	194	Официальный источник	История, продукция, контакты и текущая характеристика предприятия.
103	98	195	Реквизиты и статус	Юридическое лицо находится в стадии ликвидации.
104	99	196	Реквизиты и статус	По данным на 19.09.2026 организация действует.
105	100	197	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД, численность и отчетность.
106	159	198	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД, численность и отчетность.
107	160	199	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД и отчетность.
108	161	200	Реквизиты и показатели	ЕГРЮЛ, виды деятельности и отчетность.
109	162	201	Реквизиты и деятельность	ЕГРЮЛ и основной производственный профиль.
110	163	202	Реквизиты и деятельность	ЕГРЮЛ и основной горнодобывающий профиль.
111	164	203	Реквизиты и показатели	ЕГРЮЛ, вид деятельности и отчетность.
112	68	208	Официальный источник	Профиль и актуальная деятельность предприятия.
113	93	212	Реквизиты и статус	ЕГРЮЛ, адрес, ОКВЭД и действующий статус.
114	94	213	Реквизиты и показатели	Исправлено наименование; подтверждены реквизиты и показатели.
115	95	214	Реквизиты и показатели	ЕГРЮЛ, численность и отчетность.
116	96	215	Официальный источник	Производство РТИ, адрес и контакты.
117	97	216	Официальный источник	Производственная площадка, мощность и продукция.
118	62	218	Актуальное юридическое наименование	Юридическое лицо сейчас называется АО «Композит Групп».
119	165	210	Официальный источник	Производитель, адрес и продукция.
120	166	219	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД, численность и отчетность.
121	167	220	Реквизиты и деятельность	ЕГРЮЛ, ОКВЭД и действующий статус.
122	168	221	Реквизиты и показатели	ЕГРЮЛ, ОКВЭД и отчетность.
123	169	222	Реквизиты и деятельность	ЕГРЮЛ и производственный профиль.
124	170	223	Реквизиты и статус	Зафиксировано решение ФНС о ликвидации.
125	171	224	Показатели	Финансовые показатели, численность и зарплата за 2021–2025 годы.
126	172	226	Официальный источник	Контакты и местонахождение предприятия ТМК.
127	173	229	Реквизиты и показатели	Финансовые показатели и численность.
128	174	230	Реквизиты и показатели	Производство макаронных изделий и показатели за 2025 год.
\.


--
-- Data for Name: enterprises; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.enterprises (id, name, short_name, inn, ogrn, city_id, industry_id, okved, address, activity_description, products, website, phone, email, latitude, longitude, status, foundation_year, employee_category, is_city_forming, is_major_enterprise, economic_role) FROM stdin;
3	ООО «Новотроицкий содовый завод»	Новотроицкий содовый завод	\N	\N	1	2	\N	\N	Реализация промышленного проекта по производству химической и строительной продукции	Сода, известь, гипс, газоблоки	\N	\N	\N	\N	\N	Инвестиционный проект	\N	\N	f	f	\N
4	ООО «АККЕРМАНН ЦЕМЕНТ»	AKKERMANN CEMENT	\N	\N	1	4	\N	г. Новотроицк, территория 5,4 км автодороги Новотроицк — Орск, здание 2	Производство цемента и строительных материалов	Цемент различных марок	https://akkermann.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
5	ООО «Металекс»	Металекс	\N	\N	1	1	\N	\N	Производство ферросплавов	Ферросилиций и другие ферросплавы	https://metal-x.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
6	АО «Новотроицкий цементный завод»	НЦЗ	\N	\N	1	4	\N	г. Новотроицк, ул. Заводская, д. 3	Производство общестроительных и специальных цементов	Общестроительные цементы, тампонажные цементы, специальные материалы	https://novocement.ru/	+7 (3537) 60-19-56	\N	\N	\N	Действующее	\N	\N	f	f	\N
7	АО «Новотроицкий завод хромовых соединений»	НЗХС	\N	\N	1	2	\N	\N	Химическое и металлургическое производство соединений хрома и хромсодержащей продукции	Соединения хрома, металлический хром, феррохром	https://nzhs.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
8	ООО «Новотроицкий завод нестандартного технологического оборудования»	НЗНТО	\N	\N	1	3	\N	г. Новотроицк, ул. Восточная поляна, д. 14	Инжиниринг, производство и сервисное обслуживание промышленного оборудования	Промышленное оборудование, металлоконструкции, запасные части и комплектующие	https://nznto56.ru/	+7 (3537) 657-657	info@nznto56.ru	\N	\N	Действующее	\N	\N	f	f	\N
10	ООО «Новохром»	Новохром	\N	\N	1	2	\N	\N	Производство красителей, пигментов и неорганических химических веществ	Красители, пигменты и химические вещества	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
12	АО «Орское карьероуправление»	ОКУ	\N	\N	2	7	\N	г. Орск, Гайское шоссе, д. 10	Добыча и переработка габбро-диабазов	Щебень, строительный песок	http://www.oky56.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
13	Орский щебеночный завод — филиал АО «ПНК»	ОЩЗ	\N	\N	2	7	\N	г. Орск, ул. Маршала Конева, 2Г	Добыча и переработка нерудных полезных ископаемых	Щебень, отсев, песок	https://orsk.1pnk.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
15	ООО «Синтезспирт»	Синтезспирт	\N	\N	2	2	\N	г. Орск, ул. Тобольская, д. 5	Производство органических химических веществ	Изопропиловый спирт и химическая продукция	https://syntalco.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
16	АО «Орский машиностроительный завод»	ОМЗ	\N	\N	2	3	\N	г. Орск, ул. Крупской, д. 1	Производство оборудования и комплектующих для нефтегазовой отрасли	Замки бурильных труб, комплектующие, газовые баллоны	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
17	АО «Механический завод»	Механический завод	\N	\N	2	3	\N	г. Орск, проспект Мира, д. 4, корп. 3А	Машиностроительное производство	Специальная и гражданская промышленная продукция	https://mz-orsk.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
18	ООО «Уралмаш-Горное оборудование»	Уралмаш-ГО	\N	\N	2	3	\N	г. Орск, проспект Мира, д. 12	Производство оборудования для металлургической и горнодобывающей промышленности	Горное и металлургическое оборудование	https://uralmash-kartex.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
20	ООО «Уральский завод горного оборудования»	УЗГО	\N	\N	2	3	\N	г. Орск, ул. Дорожная, д. 21	Тяжёлое машиностроение	Дробилки, мельницы, детали экскаваторов и горного оборудования	https://uzgo-product.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
2	ООО «НСплав»	НСплав	5607141530	\N	1	1	\N	\N	Производство металлического хрома и хромовых брикетов	Металлический хром, порошок хрома, дегазированные брикеты	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
9	ООО «Оренбургский пропант»	Оренбургский пропант	5607142044	\N	1	4	\N	г. Новотроицк, ул. Заводская, здание 7	Производство керамических пропантов для нефтегазовой промышленности	Пропанты для гидравлического разрыва пласта	https://orenpropant.ru/	+7 (3537) 60-17-17	info@orenpropant.ru	\N	\N	Действующее	\N	\N	f	f	\N
21	АО «Орский завод электромонтажных изделий»	ОЗЭМИ	\N	\N	2	3	\N	г. Орск, ул. Станиславского, 50В	Производство электротехнического оборудования	Трансформаторные подстанции и распределительные устройства	https://orskemi.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
22	Орский вагоноремонтный завод — филиал ООО «НВК»	Орский ВРЗ	\N	\N	2	3	\N	г. Орск, ул. Заводская, д. 6	Ремонт железнодорожного подвижного состава	Ремонт грузовых вагонов и колесных пар	https://www.nvrk.ru/enterprise/orsk	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
23	ЗАО «Орский хлеб»	Орский хлеб	\N	\N	2	5	\N	г. Орск, ул. Союзная, д. 7	Производство хлебобулочной и кондитерской продукции	Хлеб, хлебобулочные и кондитерские изделия	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
24	ООО «Орский мясокомбинат»	Орский мясокомбинат	\N	\N	2	5	\N	г. Орск, 1-й Домбаровский переулок, д. 41	Переработка мяса и производство мясной продукции	Мясные консервы, полуфабрикаты	https://orskmk.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
25	ООО «Пивоваренный завод «Орский»»	Пивоваренный завод Орский	\N	\N	2	5	\N	г. Орск, ул. Л. Толстого / ул. Пионерская, 29/8	Производство напитков	Пиво, квас, безалкогольные напитки	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
26	ООО «Агро-Альянс ОМФ»	Орская макаронная фабрика	\N	\N	2	5	\N	г. Орск, ул. Дорожная, зд. 4	Производство макаронных изделий	Макаронные изделия	https://agro-al.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
27	ООО «НПО ОРСК»	НПО ОРСК	\N	\N	2	3	\N	\N	Производство холодильной техники и механообработка	Холодильное оборудование, компрессоры, металлические изделия	https://npoorsk.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
28	ООО «Завод Горных Машин»	ЗГМ	\N	\N	2	3	\N	г. Орск, ул. Металлистов, д. 11	Производство горнодобывающего оборудования	Дробилки, грохоты, питатели и запасные части	https://zgm.su/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
29	Завод «ГорЦемМаш»	ГорЦемМаш	\N	\N	2	3	\N	г. Орск, ул. Металлистов, д. 1	Производство оборудования и запчастей для горнодобывающей промышленности	Запчасти для дробилок, мельниц и другого оборудования	https://zavod-gcm.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
30	ООО «Орский ПЭТ завод»	Орский ПЭТ завод	\N	\N	2	8	\N	г. Орск, Вокзальное шоссе, 18А	Производство пластмассовой упаковки	ПЭТ-преформы, бутылки, колпачки	https://petzavod56.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
31	ООО «ТПК ОРСК»	Завод холодильников ORSK	\N	\N	2	3	\N	г. Орск, проспект Мира, д. 4	Полный цикл производства бытовой холодильной техники	Бытовые холодильники	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
32	ООО «Орскагромаш»	Орскагромаш	\N	\N	2	3	\N	\N	Производство сельскохозяйственной техники	Самоходные опрыскиватели и комплектующие	https://www.orskagromash.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
33	ООО «Уралпласттара»	Уралпласттара	\N	\N	2	8	\N	г. Орск, ул. Союзная, владение 7А	Производство пластмассовых изделий для упаковки товаров	Пластмассовая тара и упаковка	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
34	ООО «РОСЭлектрод-Долина»	РОСЭлектрод-Долина	\N	\N	2	1	\N	г. Орск, ул. Тобольская, д. 10	Производство сварочных материалов	Сварочные электроды	https://roselektrod-dolina.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
35	ООО «Уральский завод строительных конструкций»	УЗСК	\N	\N	2	1	\N	г. Орск, ул. Тобольская, д. 9	Производство металлических строительных конструкций	Металлоконструкции, резервуары, опоры и металлоизделия	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
36	«Спарта»	Спарта	\N	\N	2	8	\N	\N	Производство изделий из стеклопластика	Лодки, катамараны, хоккейные корты и спортивное оборудование	https://sparta-orsk.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
37	ООО «Новотроицкий завод бисульфита и пиросульфита»	НЗБП	\N	\N	1	2	\N	г. Новотроицк	Производство химических веществ	Бисульфит натрия, пиросульфит натрия	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
38	ООО «ПОДДОН СЕРВИС»	Поддон Сервис	\N	\N	1	8	\N	г. Новотроицк	Производство деревянной тары	Деревянные поддоны и паллеты	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
39	ООО «Новотроицкий завод цветных металлов»	НЗЦМ	\N	\N	1	1	\N	г. Новотроицк	Производство продукции из цветных металлов	Цветные металлы и продукция их переработки	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
40	ООО «Хлебозавод»	Новотроицкий хлебозавод	\N	\N	1	5	\N	г. Новотроицк	Производство хлебобулочной и кондитерской продукции	Хлеб, хлебобулочные и кондитерские изделия	https://7hlebozavod.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
41	АО «Новотроицкий трубопрокатный завод»	НТПЗ	5607144789	1235600005486	1	1	\N	г. Новотроицк, ул. Заводская, здание 1Р	Производство бесшовных горячедеформированных стальных труб	Бесшовные трубы для нефтегазовой, химической, строительной и машиностроительной отраслей	https://novtpz.ru/	+7 (3537) 66-43-01	info@novtpz.ru	\N	\N	Действующее	\N	\N	f	f	\N
42	ООО «Завод Элмон»	Элмон	\N	\N	1	3	\N	г. Новотроицк	Производство электротехнического оборудования	Электрощитовая продукция, светодиодные светильники	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
43	ООО «МЕТАЛЕКС»	МЕТАЛЕКС	\N	\N	1	1	\N	г. Новотроицк	Производство ферросплавов	Ферросплавы	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
44	ООО «Уральский завод технологического машиностроения»	УЗТМ	\N	\N	1	3	\N	г. Новотроицк	Производство технологического оборудования для горнодобывающей промышленности	Горное и технологическое оборудование	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
45	АО «Производственное объединение «Стрела»	ПО «Стрела»	\N	\N	3	3	\N	г. Оренбург	Крупное машиностроительное и приборостроительное предприятие	Промышленная и специальная машиностроительная продукция	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
46	АО «Завод бурового оборудования»	ЗБО	\N	\N	3	3	\N	г. Оренбург, проспект Победы, 118	Производство оборудования для буровых и геологоразведочных работ	Буровые установки, бурильные трубы, инструмент	https://zbo.ru/	+7 (3532) 75-68-14	pochta@zbo.ru	\N	\N	Действующее	\N	\N	f	f	\N
47	АО «Завод «Инвертор»	Инвертор	\N	\N	3	3	\N	г. Оренбург, проезд Автоматики, д. 8	Разработка и производство электротехнического оборудования	Инверторы, выпрямители, системы бесперебойного питания, подстанции	https://sbp-invertor.ru/	+7 (3532) 48-24-48	info@sbp-invertor.ru	\N	\N	Действующее	\N	\N	f	f	\N
48	ООО «Оренбургский радиатор»	Оренбургский радиатор	\N	\N	3	3	\N	г. Оренбург, ул. Комсомольская, 175	Разработка и серийное производство теплообменной продукции	Радиаторы и теплообменники для транспорта и специальной техники	https://orenrad.ru/	+7 (3532) 72-12-10	info@orenrad.ru	\N	\N	Действующее	\N	\N	f	f	\N
49	АО «Нефтемаслозавод»	Нефтемаслозавод	\N	\N	3	2	\N	г. Оренбург, ул. Заводская, д. 30	Переработка нефтяного сырья и производство нефтехимической продукции	Масла и нефтепродукты	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
52	ООО «Оренбургский завод металлоконструкций»	ОЗМК	\N	\N	3	1	\N	г. Оренбург	Производство металлических строительных конструкций	Быстровозводимые здания и металлоконструкции	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
53	ПАО «Гайский горно-обогатительный комбинат»	Гайский ГОК	5604000700	1025600682030	4	7	07.29.1	Оренбургская область, г. Гай, ул. Промышленная, д. 1	Добыча и обогащение медной руды. Крупнейшее горнодобывающее предприятие Гайского муниципального округа.	Медная руда, медный концентрат и другое рудное сырьё	https://ggok.ru/	+7 (35362) 6-40-30	info@ggok.ru	\N	\N	Действующее	\N	\N	t	t	Градообразующее горнодобывающее предприятие; ключевой производитель медного и цинкового концентратов
55	ООО «Медногорский медно-серный комбинат»	ММСК	5606001611	1025600752726	6	1	24.44	Оренбургская область, г. Медногорск, ул. Заводская, д. 1	Металлургическое предприятие по переработке медьсодержащего сырья и производству меди.	Черновая медь, серная кислота, цинк сернокислый в растворе и другая металлургическая продукция	https://mmsk.ugmk.com/	+7 (35379) 3-14-38	mmsk@ugmk.com	\N	\N	Действующее	1939	Крупное	t	t	Градообразующее предприятие цветной металлургии; производство черновой меди и серной кислоты
58	ПАО «Кувандыкский завод кузнечно-прессового оборудования «Долина»»	Долина	5605000830	1025600752891	12	3	28.41.2	Оренбургская область, г. Кувандык, ул. Школьная, д. 5	Производство кузнечно-прессового и металлообрабатывающего оборудования полного цикла.	Кривошипные и гидравлические прессы, пресс-ножницы, кузнечно-прессовое оборудование.	https://ao-dolina.com/	+7 (35361) 37-5-41	zavod@ao-dolina.com	\N	\N	Действующее	\N	\N	f	f	\N
57	АО «Киембаевский горно-обогатительный комбинат «Оренбургские минералы»»	Оренбургские минералы	5618000027	1025602137956	8	7	08.99.23	Оренбургская область, г. Ясный, ул. Ленина, д. 7	Градообразующее горно-обогатительное предприятие Ясного, разрабатывающее Киембаевское месторождение хризотила.	Хризотиловое волокно, щебень, гранитный отсев, песчано-щебеночные смеси и другая минеральная продукция.	https://orenmin.ru/	+7 (35368) 2-07-17	referent@orenmin.ru	\N	\N	Действующее	\N	\N	f	f	\N
66	ООО «Руссоль»	Руссоль	\N	\N	10	7	\N	г. Соль-Илецк, ул. Южная, 1/1	Добыча и производство пищевой и технической соли	Пищевая соль, техническая соль, галит, соль для животноводства	https://russalt.ru/	+7 (3532) 34-23-23	info@russalt.ru	\N	\N	Действующее	\N	\N	f	f	\N
67	ООО «Оренпласт»	Оренпласт	\N	\N	3	8	\N	г. Оренбург, ул. Локомотивная, д. 39	Производство изделий и конструкций из полимерных материалов	Пластиковые изделия и конструкции	http://www.orenplast.net/	+7 (3532) 52-58-40	\N	\N	\N	Действующее	\N	\N	f	f	\N
68	АО «Оренбургнефть»	Оренбургнефть	5612002469	1025601802357	5	7	06.10.1	Оренбургская область, г. Бузулук, ул. Магистральная, зд. 2	Разведка и добыча нефти и газа	Нефть и нефтегазовое сырье	https://www.rosneft.ru/	+7 (35342) 7-36-70	orenburgneft@rosneft.ru	\N	\N	Действующее	1994	Крупное	f	t	Крупнейшее нефтедобывающее предприятие западной части Оренбургской области; ключевой работодатель и налогоплательщик
69	ООО «Оренбургский профметалл»	Оренбургский профметалл	\N	\N	3	1	\N	г. Оренбург, ул. Илекская, д. 132	Производство профилированного металлического проката и строительных металлоконструкций	Профлист, металлочерепица, металлосайдинг, сэндвич-панели	https://www.profmetall.ru/	+7 (3532) 99-24-24	profmetall96@mail.ru	\N	\N	Действующее	\N	\N	f	f	\N
71	ООО «Сладковско-Заречное»	Сладковско-Заречное	5611037405	\N	3	7	\N	г. Оренбург, ул. Комсомольская, д. 40	Геологоразведка и добыча нефти на месторождениях Оренбургской области	Нефть, газовый конденсат	https://www.sla-zar.ru/	+7 (3532) 43-22-01	info@sla-zar.ru	\N	\N	Действующее	\N	\N	f	f	\N
73	ООО «Технология»	Технология	\N	\N	3	3	\N	г. Оренбург, проспект Победы, д. 120	Проектирование и производство оборудования общемашиностроительного и нефтегазового назначения	Машиностроительное оборудование и комплектующие	https://tehno-oren.ru/	+7 (3532) 54-06-20	info@tehno-oren.ru	\N	\N	Действующее	\N	\N	f	f	\N
74	ООО «Газпром добыча Оренбург»	Газпром добыча Оренбург	5610058025	1025601028221	3	7	\N	г. Оренбург	Добыча газа, газового конденсата и эксплуатация газовых месторождений	Природный газ, газовый конденсат, углеводородное сырье	https://orenburg-dobycha.gazprom.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
75	ООО «ВОЛМА-Оренбург»	ВОЛМА-Оренбург	\N	\N	15	4	\N	Беляевский район, п. Дубенский, ул. Заводская, д. 1	Добыча и переработка гипсового сырья, производство строительных материалов	Гипсовые строительные смеси и материалы	https://www.volma.ru/	\N	orenburg@volma.ru	\N	\N	Действующее	\N	\N	f	f	\N
76	ООО «Газпромнефть-Оренбург»	Газпромнефть-Оренбург	5610218014	1165658052450	3	7	\N	г. Оренбург, ул. Краснознаменная, д. 56/1	Разведка и добыча углеводородного сырья	Нефть и газ	https://www.gazprom-neft.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
70	АО «РИФАР»	РИФАР	5604009196	1025600684240	4	1	25.21.1	Оренбургская область, г. Гай, Технологический проезд, зд. 18/1, стр. 1	Производство отопительного оборудования и металлических радиаторов.	Алюминиевые, биметаллические, монолитные и трубчатые радиаторы отопления	https://rifar.ru/	+7 (35362) 45-113	info@rifar.ru	\N	\N	Действующее	\N	\N	f	t	Крупный производитель алюминиевых и биметаллических радиаторов отопления
61	ООО «Сорочинский маслоэкстракционный завод»	Сорочинский МЭЗ	5617020920	1105658027012	9	5	10.41.2	Оренбургская область, г. Сорочинск, ул. Староэлеваторская, влд. 4	Переработка масличных культур и производство растительных масел.	Нерафинированное подсолнечное масло, высокопротеиновый шрот и продукты переработки масличных культур.	https://www.rusagrogroup.ru/ru/biznes/maslozhirovoi-biznes/aktivy/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
72	ООО «БайТекс»	БайТекс	5602004322	1025600545266	14	7	06.10.1	Оренбургская область, г. Бугуруслан, ул. Ленинградская, зд. 51	Добыча нефти и геолого-разведочная деятельность.	Нефть и нефтяное сырье.	\N	8-903-365-02-98	EKVAKO@MAIL.RU	\N	\N	Действующее	\N	\N	f	f	\N
78	Производственная компания «Ореана»	Ореана	\N	\N	3	8	\N	г. Оренбург, ул. Аксакова, д. 8	Швейное и текстильное производство	Школьная форма, одежда и текстильная продукция	https://oreana56.ru/	+7 (3532) 31-25-22	info@oreana56.ru	\N	\N	Действующее	\N	\N	f	f	\N
79	ООО «Научно-производственный центр «ВЕЛТ»	ВЕЛТ	\N	\N	3	2	\N	г. Оренбург, ул. Беляевская, д. 4/2	Разработка и производство дезинфицирующих, стерилизующих и антисептических средств	Дезинфицирующие средства, антисептики, репелленты и специализированная химическая продукция	https://velt-npo.ru/	+7 (3532) 50-80-30	officevelt@velt-npo.ru	\N	\N	Действующее	\N	\N	f	f	\N
80	ООО «Завод ПромСтройМаш»	ПромСтройМаш	5609076936	1105658012811	3	3	\N	г. Оренбург, ул. Терешковой, д. 287А	Проектирование и производство металлообрабатывающего и кузнечно-прессового оборудования	Гидравлические прессы, листогибочные и трубогибочные машины, металлорежущие станки	https://www.stanki-zavod.ru/	+7 (3532) 48-64-76	stanki-pcm@mail.ru	\N	\N	Действующее	\N	\N	f	f	\N
81	ООО «МиСТ»	МиСТ	5638060761	1125658016681	3	1	\N	г. Оренбург, Шарлыкское шоссе, д. 5	Производство микросетчатой, плетёной и вязаной промышленной продукции	Промышленные фильтры, металлические сетки и фильтрующие элементы	https://micromesh.ru/	+7 (3532) 43-91-55	info@mst56.ru	\N	\N	Действующее	\N	\N	f	f	\N
82	ООО «СтальКом»	СтальКом	\N	\N	3	3	\N	г. Оренбург, ул. Промышленная, д. 5/1	Разработка и производство промышленного и сельскохозяйственного оборудования	Дробильное оборудование, сельскохозяйственное оборудование, металлоизделия	https://s-k56.ru/	+7 (3532) 43-77-02	stal-kom@inbox.ru	\N	\N	Действующее	\N	\N	f	f	\N
83	ООО «Полимерстрой»	Полимерстрой	\N	\N	3	8	\N	г. Оренбург, ул. Юркина, д. 17	Производство трубопроводной продукции с теплоизоляционными и антикоррозионными покрытиями	Предизолированные трубы, соединительные детали, опоры и трубы с защитными покрытиями	https://polymerstroi.com/	+7 (3532) 45-05-56	info@polymerstroi.com	\N	\N	Действующее	\N	\N	f	f	\N
84	ООО «НПП «ЭНЕРГИЯ»	НПП ЭНЕРГИЯ	5611002434	\N	3	3	\N	г. Оренбург, ул. Авторемонтная, д. 17, стр. 1	Проектирование и производство оборудования для нефтегазовой, химической и энергетической промышленности	Шаровые краны, задвижки, клапаны, вентили, фитинги и нефтегазовое оборудование	https://nppenergy.com/	+7 (3532) 61-67-01	info@nppenergy.com	\N	\N	Действующее	\N	\N	f	f	\N
85	ООО НПП «ПневМакс»	ПневМакс	\N	\N	3	3	\N	г. Оренбург	Разработка и производство роботизированных комплексов и нестандартного промышленного оборудования	Роботизированные системы, упаковочное оборудование, оборудование для нефтегазовой промышленности	https://orenteh56.ru/	+7 (3532) 44-54-43	Techmasch@mail.ru	\N	\N	Действующее	\N	\N	f	f	\N
86	ПАО «Гидропресс»	Гидропресс	\N	\N	3	3	\N	г. Оренбург, пр. Братьев Коростелевых, д. 52	Проектирование и производство кузнечно-прессового оборудования	Гидравлические прессы, гидроагрегаты, цилиндры и специализированное промышленное оборудование	https://zavodgidropress.ru/	+7 (3532) 32-32-02	gidropress@gidropress-oren.ru	\N	\N	Действующее	\N	\N	f	f	\N
88	ООО «Инженерные Технологии»	Инженерные Технологии	\N	\N	3	3	\N	г. Оренбург, ул. Илекская, д. 1	Проектирование и производство технологического оборудования для нефтегазовой и химической промышленности	Трубопроводная и фонтанная арматура, электроприводы, нефтегазовое оборудование	https://e-t-a.org/	+7 (3532) 666-777	info@e-t-a.org	\N	\N	Действующее	\N	\N	f	f	\N
89	АО Завод железобетонных изделий «Степной»	ЖБИ Степной	5609031910	1025600884110	3	4	\N	г. Оренбург, ул. Техническая, д. 4	Производство бетона и железобетонных изделий для промышленного, дорожного и гражданского строительства	Железобетонные изделия, плиты, фундаментные блоки, товарный бетон	https://www.orenbeton.ru/	+7 (3532) 66-41-66	order@orenbeton.ru	\N	\N	Действующее	\N	\N	f	f	\N
50	Оренбургский газоперерабатывающий завод ООО «Газпром переработка»	Оренбургский ГПЗ	\N	\N	18	2	\N	Оренбургская область	Переработка природного газа и газового конденсата	Газовая и нефтехимическая продукция	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
51	Оренбургский гелиевый завод ООО «Газпром переработка»	Оренбургский гелиевый завод	\N	\N	18	2	\N	Оренбургская область	Переработка газа и производство гелия	Гелий и продукты переработки природного газа	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
90	ООО «ЗАВОД РТО»	Завод РТО	5638068986	1165658058873	19	3	28.99	Оренбургская область, Оренбургский район, с. Мазуровка, ул. Заводская, д. 3	Металлообрабатывающее предприятие, производящее оборудование для нефтегазовой промышленности и энергетики	Соединительные детали трубопроводов, трубогибочные установки, оборудование для исследования скважин	https://ozrto.ru/	+7 (3532) 44-15-45	zavod-rto@yandex.ru	\N	\N	Действующее	\N	\N	f	f	\N
91	ЗАО «Птицефабрика Оренбургская»	Птицефабрика Оренбургская	5638002907	1025602724388	16	5	01.47	Оренбургская область, Оренбургский район, п. Юный, ул. Прифабричная, д. 2	Промышленное птицеводство и производство пищевой продукции	Куриное яйцо, мясо птицы, колбасная продукция, копченые мясные изделия	https://www.pfo56.ru/	+7 (3532) 399-502	\N	\N	\N	Действующее	\N	\N	f	f	\N
92	ООО «НПП «Электроисточник»	Электроисточник	5609027907	1025600891337	17	3	27.12	Оренбургская область, Оренбургский район, с. Нежинка, ул. Строительная, д. 10	Разработка и производство промышленного электротехнического оборудования и систем электроснабжения	Выпрямители, источники питания, зарядные устройства, стабилизаторы напряжения	https://electroistochnik.ru/	+7 (3532) 56-29-49	electroist@mail.ru	\N	\N	Действующее	\N	\N	f	f	\N
93	ООО «Завод Бузулук Гранит»	Бузулук Гранит	5603046371	1185658013320	5	4	23.70	Оренбургская область, г. Бузулук, ул. Промышленная, д. 1	Резка, обработка и отделка природного камня	Изделия из камня и гранита	\N	\N	\N	\N	\N	Действующее	2018	\N	f	f	Производитель изделий из природного камня и гранита
94	ООО «Бугурусланский сыродельный завод»	Бугурусланский сыродельный завод	5602023903	1155658021551	5	5	10.51	Оренбургская область, г. Бузулук, ул. Челюскинцев, д. 52, офис 1	Производство молочной продукции	Молочная и сыродельная продукция	\N	\N	\N	\N	\N	Действующее	2015	Микропредприятие	f	f	Предприятие молочной и сыродельной промышленности
95	ООО «БУЗУЛУКМОЛОКО»	Бузулукмолоко	5603011957	1025600575527	5	5	10.51	Оренбургская область, г. Бузулук, ул. Челюскинцев, д. 52	Производство молока и молочной продукции	Молоко и молочная продукция	\N	\N	\N	\N	\N	Действующее	2002	Малое	f	f	Производитель молока и молочной продукции
96	ООО «СПР»	СПР	\N	\N	5	8	\N	г. Бузулук, ул. Челюскинцев, д. 91	Производство резинотехнических и полимерных изделий для промышленного оборудования	Уплотнения, манжеты, кольца, резинотехнические изделия	https://buzuluk.spr-prom.ru/	+7 (800) 550-56-18	info@spr-prom.ru	\N	\N	Действующее	\N	\N	f	f	Производитель резинотехнических и полимерных уплотнений для промышленного оборудования
97	ООО «АСТОН-Поволжье»	АСТОН-Поволжье	5603048717	1215600006192	5	5	10.41.5	Оренбургская область, г. Бузулук, ул. Гая, д. 69, помещ. 3, офис 17; производственная площадка: ул. Юго-Западная, д. 4	Маслоэкстракционный завод по переработке масличных культур	Подсолнечное масло, высокопротеиновый подсолнечный шрот	https://buzuluk.aston.ru/	+7 (3532) 37-37-10	\N	\N	\N	Действующее	2021	Крупное	f	t	Крупный маслоэкстракционный завод; переработка семян подсолнечника мощностью до 660 тыс. тонн в год
62	АО «Композит Групп»	Бузулукский механический завод (БМЗ)	5653000012	1025600577496	5	3	29.32	Оренбургская область, г. Бузулук, ул. Рабочая, д. 81	Производство радиаторов, теплообменников, тракторной и сельскохозяйственной техники	Радиаторы, теплообменники, тракторная и сельскохозяйственная техника	https://kompozitgroup.ru/	+7 (35342) 3-02-46	kluster@kompozitgroup.ru	\N	\N	Действующее	1992	Среднее	f	t	Машиностроительная площадка бывшего Бузулукского механического завода; производство автокомпонентов, радиаторов и теплообменников
54	ООО «ГЗОЦМ «Гайская медь»	Гайская медь	5604033209	1215600001968	4	1	24.44	Оренбургская область, г. Гай, Технологический проезд, сооружение 18	Металлургическое производство и обработка цветных металлов, производство медной продукции.	Медный, латунный и бронзовый прокат, ленты, листы и другая продукция из цветных металлов	https://gzocm.ru/	+7 800 250-50-39	\N	\N	\N	Действующее	\N	\N	f	t	Крупный производитель медных и других цветных полуфабрикатов
77	ООО «Южно-Уральский Завод Спасательного Оборудования»	ЮЗСО	5604010515	1065607037341	4	3	32.99.9	Оренбургская область, г. Гай, Орское шоссе, зд. 13	Производство индивидуальных средств защиты органов дыхания и аварийно-спасательного оборудования.	Шахтные самоспасатели, изолирующие дыхательные аппараты и спасательное оборудование	https://yzso.ru/	+7 919 850-95-00	info@yzso.ru	\N	\N	Действующее	1982	\N	f	t	Производитель шахтного, пожарного и аварийно-спасательного оборудования
56	АО «Медногорский электротехнический завод «Уралэлектро»	Уралэлектро	5606000223	1025600752649	6	3	27.11.1	Оренбургская область, г. Медногорск, ул. Моторная, д. 1А	Полный технологический цикл производства электрических машин и электротехнического оборудования.	Асинхронные электродвигатели, контакторы, пусковая и распределительная аппаратура	https://uralelectro.ru/	+7 (35379) 2-92-05	mail@uralelectro.ru	\N	\N	Действующее	1941	Крупное	f	t	Крупное машиностроительное предприятие; серийное производство асинхронных электродвигателей и низковольтной аппаратуры
98	ООО «Медногорское карьероуправление»	МКУ	5606020646	1105658024890	6	7	08.12	Оренбургская область, г. Медногорск, ул. Южная Промплощадка Комплекс, д. 2	Разработка гравийных и песчаных карьеров	Щебень и нерудные строительные материалы	\N	\N	\N	\N	\N	В стадии ликвидации	2010	\N	f	f	Предприятие по добыче и выпуску нерудных строительных материалов
99	ООО «Железобетон 2005»	Железобетон 2005	5614027050	1055614027589	6	4	23.61	Оренбургская область, г. Медногорск, ул. 60 лет ДОСААФ, д. 7	Производство изделий из бетона для использования в строительстве	Железобетонные изделия	\N	\N	\N	\N	\N	Действующее	2005	Микропредприятие	f	f	Производитель железобетонных изделий для строительства
100	ООО «Медногорский пивоваренный завод»	Медногорский пивоваренный завод	5606021093	1145658007043	6	5	11.05	Оренбургская область, г. Медногорск, ул. Комсомольская, д. 33	Производство пива и безалкогольных напитков	Пиво, квас, питьевая вода и безалкогольные напитки	\N	\N	\N	\N	\N	Действующее	2014	Малое	f	f	Предприятие пищевой промышленности по производству пива и напитков
59	АО «Южно-Уральский завод магниевых соединений»	ЮУЗМС	5605021799	1145658016657	12	2	20.13	Оренбургская область, г. Кувандык, проспект Мира, д. 1	Производство основных неорганических химических веществ и продукции на основе сульфата магния.	Сульфат магния, минеральные удобрения, кормовые добавки, промышленная химия.	https://xn--g1akpf8c.xn--p1ai/	+7 (35361) 26-0-27	info@yuzms.ru	\N	\N	Действующее	\N	\N	f	f	\N
60	ООО «Южноуральский механический завод»	ЮМЗ	5605021421	1125658042905	12	3	28.41	Оренбургская область, г. Кувандык, проспект Мира, зд. 44	Производство металлообрабатывающего и кузнечно-прессового оборудования.	Гидравлические и кривошипные прессы, листогибочные станки, пресс-ножницы, ленточнопильные станки.	https://www.oooyumz.ru/	8-800-700-20-56	oooyumz@mail.ru	\N	\N	Действующее	\N	\N	f	f	\N
101	АО «Южно-Уральский криолитовый завод»	Криолит	5605000012	1025600752814	12	1	24.42	Оренбургская область, г. Кувандык, проспект Мира, д. 1	Историческое промышленное предприятие Кувандыка. Юридическое лицо сохраняется, основное производство криолитового завода остановлено.	Исторически: криолит и химическая продукция для алюминиевой промышленности.	\N	\N	\N	\N	\N	Производство остановлено	\N	\N	f	f	\N
102	ООО «Хлебокомбинат»	Кувандыкский хлебокомбинат	5605004426	1025600752825	12	5	10.71	Оренбургская область, г. Кувандык, ул. Паромная, зд. 14/1	Производство хлеба и мучных кондитерских изделий недлительного хранения.	Хлеб, хлебобулочные изделия, мучные кондитерские изделия.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
103	ООО «Кувандыкский завод механических прессов»	КЗМП	5607144468	1225600007082	12	3	28.41	Оренбургская область, г. Кувандык, проспект Мира, зд. 27В	Производство, продажа и обслуживание кузнечно-прессового и металлообрабатывающего оборудования.	Механические и кузнечно-прессовые станки, оборудование для металлообработки.	https://stankopromservis.ru/	8 (800) 550-89-68	kzmp56@mail.ru	\N	\N	Действующее	\N	\N	f	f	\N
104	ООО «Промстанкомаш»	Промстанкомаш	5605022979	1205600011033	12	3	28.41	Оренбургская область, г. Кувандык, ул. Заводская, зд. 1Б, помещ. 2	Производство металлообрабатывающего оборудования.	Металлообрабатывающее оборудование, инструмент и комплектующие.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
105	ООО Машиностроительное предприятие «ПромСтройМаш»	МП ПромСтройМаш	5610160452	1145658010794	12	3	46.62	Производственная площадка: Оренбургская область, г. Кувандык, проспект Мира, 39А; юридический адрес: г. Москва	Производственная площадка по металлообработке, ремонту, модернизации и поставке кузнечно-прессового и металлорежущего оборудования.	Металлорежущие станки, кузнечно-прессовое оборудование, трубогибочные машины, запасные части.	https://stanki-psm.ru/	+7 (35361) 3-92-97	stanki-rem.pcm@mail.ru	\N	\N	Действующее	\N	\N	f	f	\N
106	АО «Саринский элеватор»	Саринский элеватор	5632005588	1035602450498	20	8	52.10.3	Оренбургская область, Кувандыкский муниципальный округ, ж/д ст. Сара, ул. Гагарина, д. 2	Хранение и складирование зерна; объект агропромышленной инфраструктуры Кувандыкского округа.	Хранение зерна; также зарегистрировано производство готовых кормов.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
107	АО «Дубиновское хлебоприемное предприятие»	Дубиновское ХПП	5632006905	1025600752616	21	8	52.10.3	Оренбургская область, Кувандыкский муниципальный округ, ст. Дубиновка, ул. Рабочая, зд. 14	Хранение и складирование зерна, агропромышленная инфраструктура; исторически на площадке действует комбикормовое направление.	Хранение зерна, зерновая инфраструктура, комбикормовая продукция.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
108	ООО «Руссоль» — ЦДПС «Илецксоль»	Илецксоль	5611055980	1085658025650	10	7	08.93	Оренбургская область, г. Соль-Илецк, ул. Южная, зд. 1/1	Добыча и переработка каменной соли на Илецком месторождении. Производственная площадка ООО «Руссоль» в Соль-Илецке.	Пищевая соль, йодированная соль, техническая соль, галит, брикетированная соль для животноводства.	https://russalt.ru/geografiya-dobychi/czdps-ileczksol/	+7 (35336) 3-69-00	info@russalt.ru	\N	\N	Действующее	\N	\N	f	f	\N
121	ООО «Палето 2.0»	Палето 2.0	5618031755	1195658010008	8	8	14.13	Производственная площадка: Оренбургская область, г. Ясный, Фабричное шоссе, д. 2	Швейное производство. Предприятие выпускает верхнюю одежду и выполняет промышленный пошив спецодежды.	Верхняя одежда, спецодежда, текстильные изделия.	\N	+7 905 814-39-20	paleto2.0@bk.ru	\N	\N	Действующее	\N	\N	f	f	\N
109	ООО «Соль-Илецкий машиностроительный завод»	СИМЗ	5646011285	1035617275583	10	3	28.30.5	Оренбургская область, г. Соль-Илецк, ул. Гонтаренко, д. 1А, кабинет 6	Машиностроительное предприятие, специализирующееся на сельскохозяйственной технике и оборудовании.	Машины для уборки урожая, сельскохозяйственные машины, прицепы и полуприцепы, оборудование для приготовления кормов.	\N	+7 (353) 266-34-90	simz.market@yandex.ru	\N	\N	Действующее	\N	\N	f	f	\N
110	ООО «Соль-Илецкий Элеватор»	Соль-Илецкий Элеватор	5610240980	1215600001957	10	8	46.21	Оренбургская область, г. Соль-Илецк, ул. Украинская, зд. 2	Элеваторный комплекс по приемке, подработке, хранению и отгрузке зерновых, зернобобовых и масличных культур.	Услуги элеваторного хранения, подработка и отгрузка зерна; вместимость хранения до 140 тыс. тонн.	https://iletsk.ru/	+7 (922) 842-20-84	\N	\N	\N	Действующее	\N	\N	f	f	\N
111	ООО «Илецк-Строй»	Илецк-Строй	5646034701	1245600004572	10	4	23.61.1	Оренбургская область, г. Соль-Илецк, ул. Московская, д. 93	Производство готовых строительных изделий из бетона, цемента и искусственного камня.	Бетонные и железобетонные изделия, товарный бетон, сухие бетонные смеси, изделия из цемента и искусственного камня.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
112	ООО «Источник»	Источник	5646034966	1265600001820	10	5	11.07	Оренбургская область, г. Соль-Илецк, ул. Персиянова, д. 127А, кв. 1	Производство безалкогольных напитков и упакованных питьевых вод, включая минеральные воды.	Безалкогольные напитки, питьевая и минеральная вода; зарегистрировано также производство пластмассовой упаковки.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
113	ООО «Соль-Илецкий кирпичный завод»	Соль-Илецкий кирпичный завод	5646010404	1035617270765	10	4	26.40	Оренбургская область, г. Соль-Илецк, Хлебный пер., д. 1А	Историческое предприятие по производству кирпича, черепицы и строительных изделий из обожженной глины.	Кирпич, черепица и керамические строительные изделия.	\N	\N	\N	\N	\N	Ликвидировано	\N	\N	f	f	\N
114	ООО «Соль-Илецкий кирпичный завод - 1»	Соль-Илецкий кирпичный завод - 1	5646032126	1125658031971	10	4	26.40	Оренбургская область, г. Соль-Илецк, Хлебный пер., д. 1А	Историческое предприятие по производству кирпича и строительных изделий из обожженной глины.	Кирпич, черепица и керамические строительные изделия.	\N	\N	\N	\N	\N	Ликвидировано	\N	\N	f	f	\N
115	ООО «Оренгипс»	Оренгипс	5646030376	1075658012913	10	4	14.12	Оренбургская область, г. Соль-Илецк, ул. Южная, д. 7	Историческое предприятие по добыче гипсового камня и выпуску гипсовых строительных материалов.	Гипс, гипсовые изделия, изделия из бетона, гипса и цемента.	\N	\N	\N	\N	\N	Ликвидировано	\N	\N	f	f	\N
116	ООО «Уральские промышленные машины»	УралПромМаш	5618031346	1165658070126	8	3	28.99	Оренбургская область, г. Ясный, ул. Ленина, д. 7, офис 245	Машиностроительный завод — резидент ТОР «Ясный». Производит и ремонтирует промышленное оборудование для атомной, нефтегазовой и горной отраслей.	Насосное и специальное промышленное оборудование, комплектующие; ремонт и гидравлические испытания оборудования.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
117	ООО «ЦПМ»	ЦПМ	5618031586	1185658006698	8	8	13.92.1	Оренбургская область, г. Ясный, ул. Ленина, д. 9	Центр полимерных материалов. Производство готовых текстильных изделий и промышленной мягкой упаковки.	Мягкие полипропиленовые контейнеры и сверхпрочные мешки для сыпучей продукции.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
118	ООО «ОМ»	ОМ	5635041810	1165658060798	8	4	23.99	Оренбургская область, г. Ясный, ул. Ленина, д. 7, офис 201	Производство неметаллической минеральной продукции; резидент ТОР «Ясный».	Стабилизирующая добавка «Хризопро» для асфальтобетонных дорожных покрытий.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
119	ООО «Восток-СпецТехСервис»	Восток-СТС	5618031716	1195658008479	8	3	45.20	Оренбургская область, г. Ясный, ул. Ленина, д. 7, офис 311	Ремонт и техническое обслуживание карьерной, автомобильной и сельскохозяйственной техники.	Ремонт и обслуживание спецтехники и автотранспортных средств.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
120	ООО «Яснотекс»	Яснотекс	5618031709	1195658008435	8	8	14.12	Оренбургская область, г. Ясный, ул. Ленина, д. 9, помещ. 79	Швейное предприятие — резидент ТОР «Ясный». Производство спецодежды и текстильных изделий.	Спецодежда, униформа и текстильные изделия промышленного назначения.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
64	ООО «ЛБ Минералс-Светлое»	ЛБ Минералс-Светлое	5644023782	1215600002892	11	7	08.12	Оренбургская область, п. Светлый, ул. Советская, д. 22, нежилое помещение 25Б	Добыча и обогащение каолинового сырья месторождения Ковыльное.	Обогащенный каолин и минеральные продукты на основе каолина.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
122	ООО «Мастмастер»	Мастмастер	5618031770	1195658014452	8	2	20.30	Оренбургская область, г. Ясный, ул. Ленина, д. 9, офис 36	Производство красок, покрытий и мастик; промышленное производство материалов для строительства.	Гидроизоляционная кровельная мастика, асбокартон и материалы на основе минерального сырья.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
123	ООО «Мастодек»	Мастодек	5618031917	1205600013850	8	4	23.99	Оренбургская область, г. Ясный, ул. Ленина, д. 7, офис 307	Производство изделий из минерально-полимерного композита.	Террасные и палубные доски, фасадные панели, ограждения, садовая мебель и другие изделия из МПК.	https://mastodek.ru/	+7 (35368) 21-220	info@mastodek.ru	\N	\N	Действующее	\N	\N	f	f	\N
124	ООО «ОММИКС»	ОММИКС	5618031843	1205600003696	8	2	20.51	Оренбургская область, г. Ясный, ул. Ленина, д. 9, помещ. 76	Производство промышленных взрывчатых веществ и выполнение работ для горнодобывающей отрасли.	Промышленные эмульсионные и патронированные эмульсионные взрывчатые вещества.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
125	ООО «ПРОМОТОР»	ПРОМОТОР	5618031850	1205600005940	8	3	33.17	Оренбургская область, г. Ясный, ул. Ленина, д. 7, офис 202	Ремонт и техническое обслуживание железнодорожного подвижного состава и промышленного оборудования.	Ремонт железнодорожного подвижного состава, машин и электрического оборудования.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
126	ООО «Композит»	Композит	5618031900	1205600013849	8	4	23.99	Оренбургская область, г. Ясный, ул. Ленина, д. 7, офис 307	Производство неметаллической минеральной продукции и полимерно-композиционных материалов.	Гранулы полимерного композиционного материала для строительной и промышленной продукции.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
127	ООО «Ясненский хлебозавод»	Ясненский хлебозавод	5618011597	1065635007855	8	5	10.71.1	Оренбургская область, г. Ясный, ул. Уральская, д. 2А	Производство хлеба и хлебобулочных изделий недлительного хранения.	Хлеб, хлебобулочные, кондитерские и сухарные изделия.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
128	ООО «Ясненская пивоварня»	Ясненская пивоварня	5618031667	1195658006257	8	5	11.05	Оренбургская область, г. Ясный, Фабричное шоссе, д. 2, помещ. 1	Производство пива.	Пиво и сопутствующая напиточная продукция.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
129	ООО «ЭнергетикПлюс»	ЭнергетикПлюс	5618031360	1165658072634	8	6	35.30.1	Оренбургская область, г. Ясный, ул. Ленина, д. 9, помещ. 5	Производство тепловой энергии, эксплуатация котельных и тепловых сетей.	Пар и горячая вода (тепловая энергия).	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
130	ООО «Энергоресурс»	Энергоресурс	5618030399	1105658027067	8	6	35.30.2	Оренбургская область, г. Ясный, ул. Ленина, д. 9, помещ. 5, кабинет 205	Передача тепловой энергии и обслуживание коммунальной энергетической инфраструктуры.	Передача пара и горячей воды; обслуживание тепловой инфраструктуры.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
131	ООО «Кераминос»	Кераминос	5618032090	1235600010150	8	7	08.12.2	Оренбургская область, г. Ясный, ул. Октябрьская, д. 8А, помещ. 4	Инвестиционный проект по добыче каолина-сырца на Киембаевском месторождении.	Каолин-сырец.	\N	\N	\N	\N	\N	Инвестиционный проект	\N	\N	f	f	\N
132	ООО «Керамос»	Керамос	5618005040	1025602137714	8	7	08.12.2	Оренбургская область, г. Ясный, ул. Строителей, д. 2, кв. 78	Историческое предприятие по добыче глины и каолина. В отношении юридического лица открыто конкурсное производство.	Каолин и глинистое сырье.	\N	\N	\N	\N	\N	Банкротство	\N	\N	f	f	\N
133	ООО «Царь-Хлеб»	Царь-Хлеб	5618031924	1215600000131	8	5	10.71	Оренбургская область, г. Ясный, ул. Уральская, д. 2А	Предприятие по производству хлебобулочной и кондитерской продукции.	Хлеб, хлебобулочные изделия, кондитерская продукция, макаронные изделия.	\N	\N	\N	\N	\N	В процессе ликвидации	\N	\N	f	f	\N
134	ООО «Ясный Камень»	Ясный Камень	5618030751	1135658006945	8	7	08.11	Оренбургская область, г. Ясный, Фабричное шоссе, д. 2	Историческое предприятие по добыче декоративного и строительного камня.	Строительный камень и нерудные материалы.	\N	\N	\N	\N	\N	Ликвидировано	\N	\N	f	f	\N
63	ООО «Тюльганский электромеханический завод»	ТЭМЗ	5650005291	1035618981485	13	3	27.12	Оренбургская область, Тюльганский район, п. Тюльган, ул. Промышленная, зд. 13	Производство электротехнической продукции и промышленного оборудования; развитие направления комплектующих для беспилотных авиационных систем.	Электротехническая продукция, шкафы и оборудование, металлоизделия, комплектующие.	https://temz.ru/	8 800 201-23-88	info@temz.ru	\N	\N	Действующее	\N	\N	f	f	\N
65	ООО «Компонент-Лактис»	Компонент-Лактис	5602024488	1175658005643	14	5	10.89	Оренбургская область, г. Бугуруслан, Пилюгинское шоссе, зд. 51	Биотехнологическое производство комплексов микроорганизмов и функциональных пищевых продуктов.	Закваски, бактериальные концентраты, пробиотические продукты и комплексы микроорганизмов.	https://provita-lactis.ru/	+7 (35352) 3-62-80	sale@provita-lactis.ru	\N	\N	Действующее	\N	\N	f	f	\N
135	ООО «Мясокомбинат «Сорочинский»	Мясокомбинат Сорочинский	5617022780	1195658002572	9	5	10.11.1	Оренбургская область, г. Сорочинск	Историческое мясоперерабатывающее предприятие.	Охлажденное и замороженное мясо, пищевые субпродукты.	\N	\N	\N	\N	\N	Ликвидировано	\N	\N	f	f	\N
136	ЗАО «Сорочинский комбинат хлебопродуктов»	Сорочинский КХП	5617000708	1025602113107	9	5	10.61.3	Оренбургская область, г. Сорочинск, ул. Зеленая, д. 5	Историческое предприятие по переработке зерна.	Крупа и гранулы из зерновых культур.	\N	\N	\N	\N	\N	Ликвидировано	\N	\N	f	f	\N
137	ООО «Сорочинский элеватор»	Сорочинский элеватор	5617020895	1105658021512	9	8	52.10.3	Оренбургская область, г. Сорочинск, ул. Староэлеваторская, влд. 4	Приемка, хранение, складирование и послеуборочная обработка зерна.	Услуги по хранению и подработке зерновых культур.	https://rusagrolife.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
138	ООО «НПК «Фильтр»	НПК Фильтр	6319185935	1146319009495	14	3	28.29	Оренбургская область, г. Бугуруслан, Пилюгинское шоссе, зд. 110	Научно-производственное предприятие по выпуску оборудования общего назначения и оборудования для нефтегазовых скважин.	Фильтрационное и нефтегазовое оборудование, газогенераторы, аппараты фильтрования, металлообрабатывающее оборудование.	https://www.npk-filtr.ru/	+7 (846) 989-24-75	sales@npk-filtr.ru	\N	\N	Действующее	\N	\N	f	f	\N
139	АО «Оренбургнефтеотдача»	Оренбургнефтеотдача	5645001990	1025602372696	14	7	06.10.1	Оренбургская область, г. Бугуруслан, ул. Фруктовая, зд. 15	Добыча сырой нефти и эксплуатация нефтяных месторождений.	Нефть.	\N	+7 (35352) 6-42-74	\N	\N	\N	Действующее	\N	\N	f	f	\N
140	ООО «Акмел Добыча»	Акмел Добыча	5620000112	1145658339474	22	7	08.11.2	Оренбургская область, п. Акбулак, ул. Гагарина, д. 7	Исторический инвестиционный проект по добыче и первичной обработке мела и известнякового сырья.	Меловое и известняковое сырье; проект тонкодисперсного мела.	\N	\N	\N	\N	\N	Ликвидировано	\N	\N	f	f	\N
141	ООО «Степной Барашек»	Степной Барашек	5620021761	1265600002106	22	5	10.11	Оренбургская область, п. Акбулак, ул. Комсомольская, д. 46	Новое мясоперерабатывающее предприятие, зарегистрированное в 2026 году.	Переработанное и консервированное мясо, мясная продукция.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
142	ООО «Саракташский молочный завод «Анаир»	СМЗ Анаир	5643007876	1055638079056	23	5	10.51.1	Оренбургская область, п. Саракташ, ул. Мира, д. 202	Историческое молокоперерабатывающее предприятие.	Питьевое молоко, сливки, масло и молочная продукция.	\N	\N	\N	\N	\N	Ликвидировано	\N	\N	f	f	\N
143	ПК «Саракташский консервный завод»	Саракташский консервный завод	5643022105	1155658022486	23	5	10.39	Оренбургская область, п. Саракташ, ул. Калинина, д. 5	Переработка и консервирование фруктов и овощей.	Овощные и плодово-ягодные консервы, консервированная продукция.	\N	+7 (35333) 6-15-66	skz-s@yandex.ru	\N	\N	Действующее	\N	\N	f	f	\N
144	ООО «ТД «Завод Коммунар»	Завод Коммунар	5643007932	1055638082213	23	3	28.12.1	Оренбургская область, п. Саракташ, пер. Заводской, д. 1	Производственная площадка и торгово-производственная структура группы «Коммунар», специализирующаяся на гидрооборудовании.	Гидроприводы, насосы, гидропрессы, фильтры, клапанная аппаратура, гидроагрегаты.	https://kommunar.com/	+7 (35333) 6-10-15	market@kommunar.com	\N	\N	Действующее	\N	\N	f	f	\N
145	ООО «Абдулинский механический завод»	Абдулинский механический завод	5601021710	1155658013092	24	3	46.61	Оренбургская область, г. Абдулино, ул. Мира, зд. 32	Предприятие с зарегистрированными видами деятельности по производству сельскохозяйственных машин, тракторов и металлообрабатывающего оборудования.	Сельскохозяйственное и металлообрабатывающее оборудование.	\N	\N	\N	\N	\N	Предстоящее исключение из ЕГРЮЛ	\N	\N	f	f	\N
146	ООО «Мяско»	Мяско	5601021685	1155658010804	24	5	10.11.1	Оренбургская область, г. Абдулино, ул. Советская, д. 314	Переработка и производство мясной продукции.	Охлажденное и замороженное мясо, пищевые субпродукты, мясная продукция.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
147	ООО «Центр Ремонта Вагонов Абдулино»	ЦРВ Абдулино	5601020378	1085658022977	24	3	30.20.9	Оренбургская область, г. Абдулино, ул. Октябрьская, д. 1	Вагоноремонтное предприятие. Деповской, капитальный и текущий отцепочный ремонт грузовых вагонов.	Ремонт грузовых вагонов и железнодорожного подвижного состава.	https://crv-abdulino.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
148	МКП «Светлое»	Светлое	5644023888	1225600008567	11	6	35.30.1	Оренбургская область, п. Светлый, ул. Промышленная, д. 25	Муниципальное энергетическое предприятие по производству тепловой энергии котельными.	Пар и горячая вода (тепловая энергия).	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
149	АО «Элеватор Рудный Клад»	ЭРК	5644002091	1025602443525	11	8	52.10.3	Оренбургская область, п. Светлый, ул. Октябрьская, д. 1	Исторический элеваторный комплекс. Юридическое лицо продолжает существовать, однако основная деятельность по хранению зерна была прекращена после отчуждения имущественного комплекса.	Исторически: хранение и складирование зерна.	\N	\N	\N	\N	\N	Основная деятельность прекращена	\N	\N	f	f	\N
150	ООО «Тюльганский машиностроительный завод»	ТМЗ	5650082842	1055638047299	13	3	25.62	Оренбургская область, Тюльганский район, п. Тюльган, ул. Промышленная, зд. 10	Механическая обработка металлических изделий, литейное и машиностроительное производство.	Металлоизделия, изделия механической обработки, чугунное и стальное литье.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
151	ООО «Самара Лей»	Самара Лей	5640005535	1025602667441	7	3	25.30.1	Оренбургская область, Переволоцкий район, п. Переволоцкий, ул. Геологов, д. 22, офис 1	Производство паровых котлов и блочно-модульных котельных.	Паровые котлы, части котлов, блочно-модульные котельные.	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
152	ОАО «Переволоцкий элеватор»	Переволоцкий элеватор	5640002090	1025602665395	7	5	10.61.2	Оренбургская область, п. Переволоцкий, ул. Рабочая, зд. 2	Зерноперерабатывающее предприятие и элеватор.	Пшеничная мука, гречневая крупа, отруби, услуги по хранению зерна.	https://orenelevator.ru/	+7 (35338) 2-13-63	orenburgelevator@yandex.ru	\N	\N	Действующее	\N	\N	f	f	\N
1	АО «Уральская Сталь»	Уральская Сталь	5607019523	\N	1	1	\N	\N	Металлургическое предприятие	Сталь, чугун, прокат и металлургическая продукция	\N	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
14	ПАО «Орскнефтеоргсинтез»	Орский НПЗ	5615002700	\N	2	2	\N	г. Орск, ул. Гончарова, д. 1А	Переработка нефти и производство нефтепродуктов	Автомобильные бензины, дизельное топливо, мазут, нефтепродукты	https://ornpz.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
87	АО «Оренбургский маслоэкстракционный завод»	ОМЭЗ	5611001455	\N	3	5	\N	г. Оренбург, ул. Орлова, д. 11	Переработка масличных культур и производство растительного масла	Подсолнечное масло, шрот, лузга	https://orenburgoil.ru/	+7 (3532) 38-13-58	omez-oren@mail.ru	\N	\N	Действующее	\N	\N	f	f	\N
11	АО «ОРМЕТ»	ОРМЕТ	5616006746	\N	2	7	\N	\N	Добыча и первичная переработка медных и медно-цинковых руд	Медная и медно-цинковая руда	https://or-met.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
19	ООО «СМК ОРСК»	Орский завод металлоконструкций	5614049014	\N	2	1	\N	г. Орск, ул. Металлистов, д. 5	Производство строительных металлоконструкций	Металлоконструкции и быстровозводимые здания	https://ozmk.ru/	\N	\N	\N	\N	Действующее	\N	\N	f	f	\N
153	СПК «Птицефабрика Гайская»	Птицефабрика Гайская	5626008809	1025600684328	4	5	01.47	Оренбургская область, г. Гай, Технологический проезд, зд. 38	Птицеводство, производство яйца, мяса птицы и продукции глубокой переработки.	Куриное яйцо, мясо птицы, фарши, субпродукты, колбасные изделия и деликатесы	https://www.gayfa.ru/	+7 (35362) 4-26-31	\N	\N	\N	Действующее	1966	\N	f	t	Одно из крупнейших предприятий пищевого сектора Гая
154	ООО «Гаймясопром»	Гаймясопром	5604033103	1205600006886	4	5	10.13.4	Оренбургская область, г. Гай, Орское шоссе, зд. 4б	Производство мясных и мясосодержащих полуфабрикатов.	Мясные и мясосодержащие полуфабрикаты	\N	\N	\N	\N	\N	Действующее	2020	\N	f	f	Предприятие мясоперерабатывающей промышленности
155	ООО «Гаймолоко»	Гаймолоко	5604009083	1025600682689	4	5	10.51	Оренбургская область, г. Гай, Орское шоссе, зд. 15	Производство молока и молочной продукции.	Молоко и молочная продукция	\N	\N	\N	\N	\N	Действующее	2002	\N	f	f	Локальный производитель молочной продукции
156	ООО «Хлебный центр»	Хлебный центр	5604031709	1135658021872	4	5	10.71	Оренбургская область, г. Гай, ул. Ленина, д. 52, кв. 39	Производство хлеба и мучных кондитерских изделий, тортов и пирожных недлительного хранения.	Хлеб, хлебобулочные и мучные кондитерские изделия	\N	\N	\N	\N	\N	Действующее	2013	\N	f	f	Локальный производитель хлебобулочной продукции
157	ООО «Завод «Заряд»	Завод Заряд	5604009870	1045601901322	4	3	27.20	Оренбургская область, г. Гай, Орское шоссе, зд. 15	Производство электрических аккумуляторов и аккумуляторных батарей.	Электрические аккумуляторы и аккумуляторные батареи	\N	\N	\N	\N	\N	Действующее	2004	\N	f	f	Производственное предприятие электротехнического профиля
158	ООО «ФермерПродукт»	ФермерПродукт	5604032692	1175658014806	4	5	10.11	Оренбургская область, г. Гай, ул. Елшанская, д. 17	Переработка и консервирование мяса.	Мясо, мясные продукты и полуфабрикаты	\N	\N	\N	\N	\N	Действующее	2017	Микробизнес	f	f	Малое предприятие пищевой промышленности
159	ООО «ОрСнэк»	ОрСнэк	5606020830	1115658032566	6	5	10.72	Оренбургская область, г. Медногорск, ул. Моторная, стр. 1	Производство сухарей, печенья и других хлебобулочных и мучных кондитерских изделий длительного хранения.	Сухари, печенье, мучные и сахаристые кондитерские изделия	\N	\N	BUH3@ORSNEK.RU	\N	\N	Действующее	2011	Малое	f	f	Предприятие пищевой промышленности
160	ООО «Промстройкомплект»	ПСК	5606022315	1245600003120	6	4	23.69	Оренбургская область, г. Медногорск, ул. Заводская, д. 1, офис 4	Производство прочих изделий из гипса, бетона или цемента.	Изделия из бетона, цемента и гипса; строительные смеси	\N	\N	\N	\N	\N	Действующее	2024	\N	f	f	Производитель строительных материалов
161	ООО «Медногорские железобетонные изделия»	МЕДЖБИ	5606022160	1225600001923	6	4	23.63	Оренбургская область, г. Медногорск, пер. Заречный, д. 2	Производство товарного бетона, железобетонных изделий и других строительных материалов.	Товарный бетон, железобетонные изделия, сухие бетонные смеси	\N	\N	\N	\N	\N	Действующее	2022	\N	f	f	Предприятие промышленности строительных материалов
162	ООО «БРУ Уралстрой»	БРУ Уралстрой	5606022322	1245600003153	6	4	23.63	Оренбургская область, г. Медногорск, ул. Машиностроителей, д. 4, кв. 35	Производство товарного бетона и изделий из бетона для использования в строительстве.	Товарный бетон, бетонные и железобетонные изделия	\N	\N	\N	\N	\N	Действующее	2024	\N	f	f	Производитель товарного бетона и строительных материалов
163	ООО «Новый Ресурс»	Новый Ресурс	5606022354	1245600006190	6	7	07.29.2	Оренбургская область, г. Медногорск, ул. Заводская, д. 1	Добыча и обогащение никелевой и кобальтовой руд; также зарегистрированы виды деятельности по добыче медных руд и руд драгоценных металлов.	Никелевая и кобальтовая руда; рудное сырьё цветных металлов	\N	\N	\N	\N	\N	Действующее	2024	\N	f	f	Горнодобывающее предприятие, связанное с промышленным комплексом ММСК
164	ООО «Фландерс»	Фландерс	5606022379	1245600006948	6	5	11.05	Оренбургская область, г. Медногорск, ул. Комсомольская, д. 33	Производство пива и других напитков.	Пиво и напитки	\N	\N	\N	\N	\N	Действующее	2024	\N	f	f	Новое предприятие пищевой промышленности
165	ООО «РН-Бузулукское газоперерабатывающее предприятие»	РН-БГПП	5603045522	1175658018975	5	2	19.20	Оренбургская область, г. Бузулук, ул. Техническая, домовладение 10, каб. 18	Переработка попутного нефтяного газа и производство нефтегазохимической продукции.	Сжиженные углеводородные газы, газовая сера и продукты переработки попутного нефтяного газа	https://www.rosneft.ru/	+7 (35342) 39-601	bgpp_premnaya@rosneft.ru	\N	\N	Действующее	2017	Крупное	f	t	Крупное газоперерабатывающее предприятие группы «Роснефть»
166	ООО «Экономия»	Экономия	5603001719	1025600578332	5	4	23.32	Оренбургская область, г. Бузулук, ул. Чапаева, стр. 50	Производство кирпича, черепицы и прочих строительных изделий из обожженной глины.	Кирпич, керамические строительные изделия, бетонные изделия	\N	\N	\N	\N	\N	Действующее	1998	Малое	f	f	Производитель строительных материалов
167	ООО «Заготовитель»	Заготовитель	5625006157	1045613150494	5	5	10.11.1	Оренбургская область, г. Бузулук, ул. Фрунзе, стр. 3	Производство мяса в охлажденном виде и мясной продукции.	Охлажденное и замороженное мясо, пищевые субпродукты, мясная продукция	\N	\N	\N	\N	\N	Действующее	2004	Микропредприятие	f	f	Локальное мясоперерабатывающее предприятие
168	ООО «Производственная компания Альянс»	ПК Альянс	5603048435	1215600001792	5	5	11.07	Оренбургская область, г. Бузулук, ул. Плодопитомническая, двлд. 5	Производство безалкогольных напитков и упакованных питьевых вод, включая минеральные воды.	Безалкогольные напитки, питьевая и минеральная вода; пиво по дополнительному виду деятельности	\N	\N	\N	\N	\N	Действующее	2021	\N	f	f	Производитель напитков и упакованной питьевой воды
169	ООО «Стройаэрокуб»	Стройаэрокуб	5603050882	1255600001964	5	4	23.61	Оренбургская область, г. Бузулук, ул. 4-я Линия, д. 42	Производство изделий из бетона для использования в строительстве.	Бетонные и железобетонные изделия	\N	\N	\N	\N	\N	Действующее	2025	\N	f	f	Новое предприятие промышленности строительных материалов
170	ООО «Бузулукский ликероводочный завод»	Бузулукский ликероводочный завод	5603042987	1155658017987	5	5	11.01.1	Оренбургская область, г. Бузулук, ул. Промышленная, д. 1	Производство дистиллированных алкогольных напитков и безалкогольных напитков.	Водка, ликероводочные и безалкогольные напитки	\N	\N	\N	\N	\N	Есть решение ФНС о ликвидации	2015	\N	f	f	Промышленное предприятие пищевой отрасли, находящееся в процедуре ликвидации
171	ООО «Бузулукское молоко»	Бузулукское молоко	5603017010	1065603033429	5	5	10.5	Оренбургская область, г. Бузулук, ул. Челюскинцев, двлд. 52	Производство молочной продукции, включая питьевое молоко, сливки, масло и сырную продукцию.	Молоко, сливки, масло, сыр и другая молочная продукция	\N	\N	\N	\N	\N	Действующее	2006	Крупное	f	t	Крупное предприятие молочной промышленности Бузулука
172	ООО «ТМК Нефтегазсервис - Бузулук»	ТМК НГС - Бузулук	5603011770	1025600575660	5	3	09.10.9	Оренбургская область, г. Бузулук, ул. Техническая, стр. 6	Нефтегазосервис, ремонт и обслуживание трубной продукции и оборудования; механическая обработка металлических изделий.	Ремонт и сервис труб нефтяного сортамента, металлообработка и нефтегазосервисные работы	https://tmk-ngs.tmk-group.ru/	+7 (35342) 7-32-75	tmkngs-buzuluk@tmk-group.com	\N	\N	Действующее	2002	Крупное	f	t	Крупное нефтегазосервисное предприятие ТМК
173	ООО «Городской торг»	Горторг	5603014436	1045601154906	5	5	10.13	Оренбургская область, г. Бузулук, ул. Промышленная, стр. 9	Производство продукции из мяса убойных животных и мяса птицы.	Колбасные изделия, мясные полуфабрикаты и другая мясная продукция	\N	\N	gortorgbaza@mail.ru	\N	\N	В процессе реорганизации	2004	Среднее	f	t	Крупное мясоперерабатывающее предприятие города
174	ООО «Горторг-Д»	Горторг-Д	5603015060	1055603000000	5	5	10.73.1	Оренбургская область, г. Бузулук, ул. Промышленная, стр. 9	Производство макаронных изделий.	Макаронные изделия	\N	\N	\N	\N	\N	Действующее	\N	Малое	f	f	Производитель макаронных изделий
\.


--
-- Data for Name: industries; Type: TABLE DATA; Schema: public; Owner: -
--

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


--
-- Data for Name: investment_projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.investment_projects (id, name, city_id, enterprise_id, industry_id, status, start_year, end_year, investment_amount, jobs_created, description, source_id) FROM stdin;
1	Добыча каолина-сырца на Киембаевском месторождении	8	131	7	Реализация                                                                                          	2026	2027	70000000	28	Проект ООО «Кераминос». Инвестиции заявлены в объеме более 70 млн рублей; ввод производства запланирован на 2027 год.	39
2	ЛБ Минералс-Светлое — обогащение каолина	11	64	7	Реализован                                                                                          	\N	\N	1300000000	80	Проект по обогащению каолинов месторождения Ковыльное и производству продуктов на основе каолина.	78
3	АСТОН-Поволжье — строительство маслоэкстракционного завода	5	97	5	Реализован	\N	2024	10300000000	319	Строительство маслоэкстракционного завода по переработке масличных культур в Оренбургской области.	237
4	Комплекс глубокой переработки масличных культур в Бузулуке	5	\N	5	Инвестиционный проект	\N	2026	23400000000	521	Проект интегрированного комплекса по глубокой переработке масличных культур, бутилированию растительных масел, производству майонезов и соусов.	237
\.


--
-- Data for Name: territory_metrics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.territory_metrics (id, city_id, year, population, average_salary, unemployment_rate, investments, industrial_output, employed_population, enterprises_count, industrial_enterprises_count, source_id) FROM stdin;
1	10	2024	45181	44628.50	0.80	1947780000.00	5135800000.00	\N	\N	\N	24
2	4	2024	\N	66276.90	\N	\N	\N	\N	\N	\N	191
3	6	2021	24300	\N	\N	\N	\N	\N	\N	\N	204
4	6	2022	23700	\N	\N	\N	\N	\N	\N	\N	204
5	6	2023	23400	\N	\N	\N	\N	\N	\N	\N	204
6	6	2024	23013	\N	\N	\N	\N	\N	\N	\N	205
7	6	2025	22723	\N	\N	\N	\N	\N	\N	\N	206
8	5	2021	86042	\N	\N	\N	\N	\N	\N	\N	231
9	5	2022	88250	\N	\N	\N	\N	\N	\N	\N	232
10	5	2023	88419	\N	\N	\N	\N	\N	\N	\N	232
11	5	2024	88300	\N	\N	\N	\N	\N	\N	\N	233
12	5	2025	88202	\N	\N	\N	\N	\N	\N	\N	234
\.


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cities_id_seq', 24, true);


--
-- Name: data_sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.data_sources_id_seq', 237, true);


--
-- Name: enterprise_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.enterprise_metrics_id_seq', 123, true);


--
-- Name: enterprise_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.enterprise_products_id_seq', 111, true);


--
-- Name: enterprise_sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.enterprise_sources_id_seq', 128, true);


--
-- Name: enterprises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.enterprises_id_seq', 174, true);


--
-- Name: industries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.industries_id_seq', 16, true);


--
-- Name: investment_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.investment_projects_id_seq', 4, true);


--
-- Name: territory_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.territory_metrics_id_seq', 12, true);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: data_sources data_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_sources
    ADD CONSTRAINT data_sources_pkey PRIMARY KEY (id);


--
-- Name: enterprise_metrics enterprise_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_metrics
    ADD CONSTRAINT enterprise_metrics_pkey PRIMARY KEY (id);


--
-- Name: enterprise_products enterprise_products_enterprise_id_product_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_products
    ADD CONSTRAINT enterprise_products_enterprise_id_product_name_key UNIQUE (enterprise_id, product_name);


--
-- Name: enterprise_products enterprise_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_products
    ADD CONSTRAINT enterprise_products_pkey PRIMARY KEY (id);


--
-- Name: enterprise_sources enterprise_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_sources
    ADD CONSTRAINT enterprise_sources_pkey PRIMARY KEY (id);


--
-- Name: enterprises enterprises_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprises
    ADD CONSTRAINT enterprises_pkey PRIMARY KEY (id);


--
-- Name: industries industries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industries
    ADD CONSTRAINT industries_pkey PRIMARY KEY (id);


--
-- Name: investment_projects investment_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_projects
    ADD CONSTRAINT investment_projects_pkey PRIMARY KEY (id);


--
-- Name: territory_metrics territory_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.territory_metrics
    ADD CONSTRAINT territory_metrics_pkey PRIMARY KEY (id);


--
-- Name: enterprise_sources uq_enterprise_source; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_sources
    ADD CONSTRAINT uq_enterprise_source UNIQUE (enterprise_id, source_id);


--
-- Name: enterprise_metrics uq_enterprise_year; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_metrics
    ADD CONSTRAINT uq_enterprise_year UNIQUE (enterprise_id, year);


--
-- Name: idx_enterprise_metrics_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enterprise_metrics_year ON public.enterprise_metrics USING btree (year);


--
-- Name: idx_enterprise_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enterprise_products_category ON public.enterprise_products USING btree (product_category);


--
-- Name: idx_enterprise_products_enterprise; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enterprise_products_enterprise ON public.enterprise_products USING btree (enterprise_id);


--
-- Name: idx_enterprises_city; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enterprises_city ON public.enterprises USING btree (city_id);


--
-- Name: idx_enterprises_industry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enterprises_industry ON public.enterprises USING btree (industry_id);


--
-- Name: idx_enterprises_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enterprises_status ON public.enterprises USING btree (status);


--
-- Name: uq_enterprise_products_enterprise_product; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_enterprise_products_enterprise_product ON public.enterprise_products USING btree (enterprise_id, product_name);


--
-- Name: uq_territory_city_year; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_territory_city_year ON public.territory_metrics USING btree (city_id, year) WHERE (city_id IS NOT NULL);


--
-- Name: ux_industries_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ux_industries_name ON public.industries USING btree (name);


--
-- Name: enterprise_products enterprise_products_enterprise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_products
    ADD CONSTRAINT enterprise_products_enterprise_id_fkey FOREIGN KEY (enterprise_id) REFERENCES public.enterprises(id) ON DELETE CASCADE;


--
-- Name: enterprise_metrics fk_enterprise_metrics_source; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_metrics
    ADD CONSTRAINT fk_enterprise_metrics_source FOREIGN KEY (source_id) REFERENCES public.data_sources(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: enterprise_products fk_enterprise_products_source; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_products
    ADD CONSTRAINT fk_enterprise_products_source FOREIGN KEY (source_id) REFERENCES public.data_sources(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: enterprise_sources fk_enterprise_sources_enterprise; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_sources
    ADD CONSTRAINT fk_enterprise_sources_enterprise FOREIGN KEY (enterprise_id) REFERENCES public.enterprises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enterprise_sources fk_enterprise_sources_source; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_sources
    ADD CONSTRAINT fk_enterprise_sources_source FOREIGN KEY (source_id) REFERENCES public.data_sources(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enterprises fk_enterprises_city; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprises
    ADD CONSTRAINT fk_enterprises_city FOREIGN KEY (city_id) REFERENCES public.cities(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: enterprises fk_enterprises_industry; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprises
    ADD CONSTRAINT fk_enterprises_industry FOREIGN KEY (industry_id) REFERENCES public.industries(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: enterprise_metrics fk_metrics_enterprise; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_metrics
    ADD CONSTRAINT fk_metrics_enterprise FOREIGN KEY (enterprise_id) REFERENCES public.enterprises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: investment_projects fk_project_city; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_projects
    ADD CONSTRAINT fk_project_city FOREIGN KEY (city_id) REFERENCES public.cities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: investment_projects fk_project_enterprise; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_projects
    ADD CONSTRAINT fk_project_enterprise FOREIGN KEY (enterprise_id) REFERENCES public.enterprises(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: investment_projects fk_project_industry; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_projects
    ADD CONSTRAINT fk_project_industry FOREIGN KEY (industry_id) REFERENCES public.industries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: investment_projects fk_project_source; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_projects
    ADD CONSTRAINT fk_project_source FOREIGN KEY (source_id) REFERENCES public.data_sources(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: territory_metrics fk_territory_metrics_city; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.territory_metrics
    ADD CONSTRAINT fk_territory_metrics_city FOREIGN KEY (city_id) REFERENCES public.cities(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: territory_metrics fk_territory_metrics_source; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.territory_metrics
    ADD CONSTRAINT fk_territory_metrics_source FOREIGN KEY (source_id) REFERENCES public.data_sources(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict unbH1b4KFdZAMcvn3bsQqEoz2AOZUcM1PbSPNYVkgGacoteQpWd32oi0b366MYp

