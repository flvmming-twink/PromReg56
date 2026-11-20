-- Применить после database/migrate_city_cards_existing_db.sql к работающей БД.
-- Не заменяет подтверждённые значения и не удаляет данные; все модельные значения маркированы.
BEGIN;
INSERT INTO public.data_sources(id,name,url,source_type,publication_date,access_date,description)
VALUES
(365,'Новотроицк: зарплата за январь–август 2025, данные мэрии в Ntsk.ru','https://ntsk.ru/news/61118','Местная пресса / первичные сведения мэрии',NULL,'2026-11-20','Применено только для модельного пересчёта годовой зарплаты; оценку не считать официальной.'),
(366,'Оренбург: муниципальный прогноз социально-экономического развития на 2021 год','https://base.garant.ru/402953552/31de5683116b8d79b08fa2d768e33df6/','Муниципальный прогноз (ГАРАНТ)',NULL,'2026-11-20','Оценки промышленности, ИПП, прибыли на 2021 год.'),
(367,'Росстат: социально-экономическое положение региональных центров ПФО 2021–2022','https://kulturaufa.ru/wp-content/uploads/2023/11/sbornik-ufa-za-2022g.pdf','Официальный статистический сборник',NULL,'2026-11-20','2021: инвестиции Оренбурга 54 336.2 млн руб. по ограниченному кругу организаций.'),
(368,'Оренбург: отчет главы города за 2021 год в местных СМИ','https://oburg.ru/news/36667-sergeju-salminu-predstoit-otchitatsja-o-rabote-prezhnego-glavy-orenburga.html','Публикация по муниципальной статистике',NULL,'2026-11-20','Зарегистрированная безработица в 2021 году 0.72%; вторичный источник.'),
(369,'Оренбургстат: статистический ежегодник Оренбурга 2021 (презентация)','https://56.rosstat.gov.ru/storage/mediabank/1.%D0%92%D1%8B%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0_%D0%A1%D0%B2%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9.pdf','Официальная региональная статистика',NULL,'2026-11-20','Численность населения муниципального образования на 01.01.2021 587408 человек.')
ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,url=EXCLUDED.url,
 source_type=EXCLUDED.source_type,publication_date=EXCLUDED.publication_date,
 access_date=EXCLUDED.access_date,description=EXCLUDED.description;

-- Заполняем только поля, которые пока равны NULL.
UPDATE public.territory_metrics SET average_salary=COALESCE(average_salary,85965.20)
WHERE city_id=1 AND year=2025;
UPDATE public.territory_metrics SET
 population=COALESCE(population,587408),
 unemployment_rate=COALESCE(unemployment_rate,0.72),
 investments=COALESCE(investments,54336200000),
 industrial_output=COALESCE(industrial_output,250300000000)
WHERE city_id=3 AND year=2021;

-- Детальные значения и методы расчёта, с источниками.
INSERT INTO public.city_annual_indicators(city_id,year,metric_code,numeric_value,unit,source_metric_name,verification_status,source_id,as_of_date,coverage_note)
VALUES
(1,2025,'average_salary',85965.2,'руб.','Среднемесячная зарплата в крупных и средних организациях, ₽','municipal_estimate',365,NULL,'Модельная оценка средней зарплаты за весь 2025 год: 74255.2 × 1.1577 = 85965.2 руб. Коэффициент 1.1577 — темп января–августа 2025 года к аналогичному периоду 2024 года. Наблюдаемая зарплата за январь–август 2025 года — 83434.1 руб. Итоговый показатель года не подтверждён.'),
(3,2021,'industrial_shipments',250.3,'млрд руб.','Оценка объёма промышленного производства, млрд ₽','municipal_estimate',366,NULL,'Оценка муниципального прогноза от 15.10.2021: объём промышленного производства 250.3 млрд руб. Не окончательная отгрузка и не обязательно сопоставим с итоговыми данными за 2022–2025 годы.'),
(3,2021,'industrial_production_index',100.1,'%','Индекс промышленного производства, % к предыдущему году','municipal_estimate',366,NULL,'Муниципальный прогноз от 15.10.2021: 100.1% к 2020 году в сопоставимых ценах, не итоговый отчёт.'),
(3,2021,'investments',54.3362,'млрд руб.','Инвестиции в основной капитал без субъектов малого предпринимательства, млрд ₽','reported',367,NULL,'Официальный статистический сборник центров ПФО: 54336.2 млн руб. инвестиций без субъектов малого предпринимательства и оценок, не наблюдаемых прямыми статистическими методами. Охват отличается от полного круга в 2022–2025.'),
(3,2021,'registered_unemployment',0.72,'%','Зарегистрированная безработица на конец года, %','reported',368,NULL,'0.72% зарегистрированной безработицы по публикации о годовом отчёте главы города за 2021 год; вторичный источник.'),
(3,2021,'population',587.408,'тыс. чел.','Численность населения муниципального образования на 1 января, тыс. человек','reported',369,'2021-01-01','587408 человек — МО город Оренбург на 01.01.2021 по Оренбургстату; моментное наблюдение на начало года.'),
(3,2021,'profitable_organizations_profit',37.4,'млрд руб.','Прибыль прибыльных организаций, млрд ₽','municipal_estimate',366,NULL,'37.4 млрд руб. — оценка 2021 года в муниципальном прогнозе от 15.10.2021; не окончательная отчётная прибыль.')
ON CONFLICT (city_id,year,metric_code) DO UPDATE SET
 numeric_value=EXCLUDED.numeric_value,
 unit=EXCLUDED.unit,
 source_metric_name=EXCLUDED.source_metric_name,
 verification_status=EXCLUDED.verification_status,
 source_id=EXCLUDED.source_id,
 as_of_date=EXCLUDED.as_of_date,
 coverage_note=EXCLUDED.coverage_note
WHERE public.city_annual_indicators.numeric_value IS NULL;
SELECT setval(
 pg_get_serial_sequence('public.data_sources','id'),
 GREATEST((SELECT max(id) FROM public.data_sources),1),
 true
);
COMMIT;
SELECT city_id,year,metric_code,numeric_value,verification_status
FROM public.city_annual_indicators
WHERE (city_id=3 AND year=2021) OR (city_id=1 AND year=2025 AND metric_code='average_salary')
ORDER BY city_id,year,metric_code;
