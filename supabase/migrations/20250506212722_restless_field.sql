/*
  # Add Sample Presentations

  1. Changes
    - Insert sample presentations for existing companies
    - Add realistic presentation data with titles, dates, and URLs
    - Include view counts and slide counts
*/

INSERT INTO presentations (
  company_id,
  company_symbol,
  title,
  date,
  url,
  file_type,
  file_size,
  slide_count,
  view_count,
  summary,
  thumbnail_url
)
SELECT 
  c.id,
  c.symbol,
  CASE floor(random() * 4)
    WHEN 0 THEN c.name || ' Q4 2023 Earnings Presentation'
    WHEN 1 THEN c.name || ' Investor Day 2024'
    WHEN 2 THEN c.name || ' Corporate Overview'
    WHEN 3 THEN c.name || ' Strategic Update'
  END as title,
  (current_date - (floor(random() * 90) || ' days')::interval)::date as date,
  c.ir_url || '/presentations/' || floor(random() * 1000)::text || '.pdf' as url,
  'pdf' as file_type,
  floor(random() * 15 + 5)::text || ' MB' as file_size,
  floor(random() * 40 + 20) as slide_count,
  floor(random() * 5000) as view_count,
  'This presentation provides an overview of ' || c.name || '''s performance, strategy, and market position in the ' || c.industry || ' sector.' as summary,
  'https://picsum.photos/seed/' || c.id || '/800/600' as thumbnail_url
FROM companies c
CROSS JOIN generate_series(1, 3)
ON CONFLICT DO NOTHING;