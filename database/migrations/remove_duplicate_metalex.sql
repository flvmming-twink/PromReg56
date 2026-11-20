-- Удаление дублирующей записи ООО «МЕТАЛЕКС» (id=43).
-- Основная запись id=5 с ИНН 5607011852 сохраняется.
-- Для текущей расширенной базы допускается пустой ИНН у дубля; дополнительно сверяются город и отрасль.
BEGIN;
DO $$
BEGIN
 IF EXISTS (
  SELECT 1 FROM public.enterprises d
  JOIN public.enterprises k ON k.id=5
  WHERE d.id=43 AND (d.inn IS NULL OR d.inn='5607011852') AND upper(d.name) LIKE '%МЕТАЛЕКС%'
    AND k.inn='5607011852' AND upper(k.name) LIKE '%МЕТАЛЕКС%'
    AND d.city_id=k.city_id AND d.industry_id=k.industry_id
 ) THEN
  DELETE FROM public.enterprise_metrics WHERE enterprise_id=43;
  DELETE FROM public.enterprise_sources WHERE enterprise_id=43;
  DELETE FROM public.enterprise_products WHERE enterprise_id=43;
  DELETE FROM public.enterprises WHERE id=43;
 END IF;
END $$;
COMMIT;
SELECT id,name,inn FROM public.enterprises WHERE inn='5607011852' ORDER BY id;
