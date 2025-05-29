/*
  # Add Sample Presentations and Tags

  1. Changes
    - Insert sample presentations for each company
    - Add relevant tags with null check
    - Ensure all tags are valid non-null values
*/

-- Insert sample presentations
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
  p.title,
  p.presentation_date,
  c.ir_url || '/presentations/' || lower(regexp_replace(p.title, '[^a-zA-Z0-9]+', '-', 'g')) || '.pdf',
  'pdf',
  p.file_size || ' MB',
  p.slide_count,
  floor(random() * 1000 + 100),
  p.summary,
  'https://picsum.photos/seed/' || c.id || '/800/600'
FROM companies c
CROSS JOIN (
  VALUES 
    (
      'Q4 2024 Earnings Presentation',
      current_date - interval '5 days',
      15,
      45,
      'Detailed overview of financial performance and key metrics for Q4 2024'
    ),
    (
      'Investor Day 2024',
      current_date - interval '30 days',
      25,
      60,
      'Comprehensive presentation of company strategy, market position, and future growth plans'
    ),
    (
      'Strategic Growth Initiatives',
      current_date - interval '60 days',
      10,
      30,
      'Overview of key growth initiatives and market expansion plans'
    )
) AS p(title, presentation_date, file_size, slide_count, summary)
ON CONFLICT DO NOTHING;

-- Add relevant tags with null check
WITH presentation_tag_data AS (
  SELECT 
    p.id as presentation_id,
    t.tag
  FROM presentations p
  JOIN companies c ON p.company_id = c.id
  CROSS JOIN LATERAL (
    VALUES 
      (CASE 
        WHEN p.title LIKE '%Earnings%' THEN 'Earnings'
        WHEN p.title LIKE '%Investor Day%' THEN 'Investor Day'
        ELSE 'Corporate Strategy'
      END),
      ('Financial Performance'),
      (NULLIF(c.industry, '')),
      (NULLIF(c.sector, '')),
      (CASE 
        WHEN random() < 0.3 THEN 'Market Expansion'
        WHEN random() < 0.3 THEN 'Innovation'
        WHEN random() < 0.3 THEN 'Digital Transformation'
        ELSE 'Growth Strategy'
      END)
  ) AS t(tag)
  WHERE t.tag IS NOT NULL
)
INSERT INTO presentation_tags (presentation_id, tag)
SELECT DISTINCT presentation_id, tag
FROM presentation_tag_data
ON CONFLICT DO NOTHING;