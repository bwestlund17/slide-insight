/*
  # Add Sample Presentation Tags

  1. Changes
    - Add relevant tags for each presentation
    - Tags based on presentation content and company industry
*/

WITH common_tags AS (
  SELECT unnest(ARRAY[
    'Quarterly Results',
    'Financial Performance',
    'Strategic Initiatives',
    'Market Overview',
    'Growth Strategy',
    'Innovation',
    'ESG',
    'Digital Transformation',
    'Operational Excellence',
    'Customer Focus'
  ]) as tag
)
INSERT INTO presentation_tags (presentation_id, tag)
SELECT 
  p.id,
  t.tag
FROM presentations p
CROSS JOIN common_tags t
WHERE random() < 0.3
ON CONFLICT DO NOTHING;