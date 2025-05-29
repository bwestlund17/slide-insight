/*
  # Add Fresh Sample Presentations

  1. Changes
    - Insert sample presentations with proper URLs
    - Add relevant tags with null checks
    - Ensure all required fields are populated
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
WHERE NOT EXISTS (
  SELECT 1 FROM presentations WHERE company_id = c.id
);

-- Add relevant tags with strict null checks
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
WHERE NOT EXISTS (
  SELECT 1 FROM presentation_tags 
  WHERE presentation_id = presentation_tag_data.presentation_id 
  AND tag = presentation_tag_data.tag
);