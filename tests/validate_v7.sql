-- Use inside a PostgreSQL test DB after applying FRESH or UPDATE_AFTER_V6.
DO $v7tests$
DECLARE n int;
BEGIN
 SELECT COUNT(*) INTO n FROM public.v7_public_enterprises;
 IF n<>59 THEN RAISE EXCEPTION 'Expected 59 enterprises, got %',n; END IF;
 SELECT COUNT(*) INTO n FROM public.v7_public_metric_values;
 IF n<>761 THEN RAISE EXCEPTION 'Expected 761 observations, got %',n; END IF;
 SELECT COUNT(*) INTO n FROM public.v7_eligible_metric_series;
 IF n<>187 THEN RAISE EXCEPTION 'Expected 187 metric series, got %',n; END IF;
 SELECT COUNT(*) INTO n FROM public.v7_company_sources;
 IF n<>107 THEN RAISE EXCEPTION 'Expected 107 source links, got %',n; END IF;
 SELECT COUNT(*) INTO n FROM public.v7_staff_latest;
 IF n<>15 THEN RAISE EXCEPTION 'Expected 15 latest workforce snapshots, got %',n; END IF;
 IF EXISTS(SELECT 1 FROM public.v7_eligible_metric_series WHERE years_available < 2)
  THEN RAISE EXCEPTION 'Series threshold failed'; END IF;
 IF EXISTS(SELECT 1 FROM public.v7_public_metric_values WHERE value_numeric IS NULL OR value_numeric=0 OR period_year NOT BETWEEN 2021 AND 2025)
  THEN RAISE EXCEPTION 'Value/year/zero constraint failed'; END IF;
 IF EXISTS(SELECT 1 FROM public.v7_public_enterprises WHERE id IN (88,1002))
  THEN RAISE EXCEPTION 'Non-city or zero-only enterprise present'; END IF;
 IF EXISTS(SELECT 1 FROM public.v7_company_sources GROUP BY enterprise_id HAVING COUNT(*)>2)
  THEN RAISE EXCEPTION 'Too many source links'; END IF;
 RAISE NOTICE 'PROMREGION56 v7 POSTGRESQL CHECKS PASSED';
END $v7tests$;
