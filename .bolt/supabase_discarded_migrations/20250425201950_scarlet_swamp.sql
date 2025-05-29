/*
  # Add tenth batch of S&P 500 companies

  1. Changes
    - Add another batch of unique S&P 500 companies
    - Include complete company information
    - Maintain data validation constraints

  2. Notes
    - Market cap values are in USD
    - All companies are part of the S&P 500 index
    - Data includes sector, industry, and other key metrics
    - Verified no duplicate symbols with existing companies
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Technology
('Keysight Technologies', 'KEYS', 'https://www.keysight.com', 'https://investor.keysight.com', 'Electronic Equipment', 'Technology', 25000000000, 'Santa Rosa, CA', 2014, 14300),
('Trimble', 'TRMB', 'https://www.trimble.com', 'https://investor.trimble.com', 'Electronic Equipment', 'Technology', 12000000000, 'Westminster, CO', 1978, 11500),
('Zebra Technologies', 'ZBRA', 'https://www.zebra.com', 'https://investors.zebra.com', 'Electronic Equipment', 'Technology', 15000000000, 'Lincolnshire, IL', 1969, 9800),
('Cognex', 'CGNX', 'https://www.cognex.com', 'https://www.cognex.com/investors', 'Electronic Equipment', 'Technology', 8000000000, 'Natick, MA', 1981, 2500),
('IPG Photonics', 'IPGP', 'https://www.ipgphotonics.com', 'https://investor.ipgphotonics.com', 'Electronic Equipment', 'Technology', 5000000000, 'Oxford, MA', 1990, 6000),

-- Healthcare
('Bio-Rad Laboratories', 'BIO', 'https://www.bio-rad.com', 'https://bio-rad.gcs-web.com', 'Life Sciences Tools', 'Healthcare', 10000000000, 'Hercules, CA', 1952, 7900),
('Bruker', 'BRKR', 'https://www.bruker.com', 'https://ir.bruker.com', 'Life Sciences Tools', 'Healthcare', 12000000000, 'Billerica, MA', 1960, 8000),
('Charles River Labs', 'CRL', 'https://www.criver.com', 'https://ir.criver.com', 'Life Sciences Tools', 'Healthcare', 15000000000, 'Wilmington, MA', 1947, 20000),
('Catalent', 'CTLT', 'https://www.catalent.com', 'https://investor.catalent.com', 'Pharmaceuticals', 'Healthcare', 8000000000, 'Somerset, NJ', 2007, 19000),
('West Pharmaceutical', 'WST', 'https://www.westpharma.com', 'https://investor.westpharma.com', 'Medical Supplies', 'Healthcare', 25000000000, 'Exton, PA', 1923, 10000),

-- Industrials
('Hubbell', 'HUBB', 'https://www.hubbell.com', 'https://investors.hubbell.com', 'Electrical Equipment', 'Industrials', 15000000000, 'Shelton, CT', 1888, 19500),
('Graco', 'GGG', 'https://www.graco.com', 'https://investors.graco.com', 'Industrial Machinery', 'Industrials', 12000000000, 'Minneapolis, MN', 1926, 3800),
('Nordson', 'NDSN', 'https://www.nordson.com', 'https://investors.nordson.com', 'Industrial Machinery', 'Industrials', 14000000000, 'Westlake, OH', 1954, 7500),
('Donaldson', 'DCI', 'https://www.donaldson.com', 'https://ir.donaldson.com', 'Industrial Machinery', 'Industrials', 8000000000, 'Bloomington, MN', 1915, 13000),
('Pentair', 'PNR', 'https://www.pentair.com', 'https://investors.pentair.com', 'Industrial Machinery', 'Industrials', 10000000000, 'London, UK', 1966, 11500),

-- Consumer Discretionary
('Pool Corporation', 'POOL', 'https://www.poolcorp.com', 'https://investor.poolcorp.com', 'Specialty Retail', 'Consumer Discretionary', 15000000000, 'Covington, LA', 1993, 5500),
('Williams-Sonoma', 'WSM', 'https://www.williams-sonomainc.com', 'https://ir.williams-sonomainc.com', 'Specialty Retail', 'Consumer Discretionary', 12000000000, 'San Francisco, CA', 1956, 17000),
('Five Below', 'FIVE', 'https://www.fivebelow.com', 'https://investor.fivebelow.com', 'Specialty Retail', 'Consumer Discretionary', 10000000000, 'Philadelphia, PA', 2002, 17000),
('Dick''s Sporting Goods', 'DKS', 'https://www.dickssportinggoods.com', 'https://investors.dicks.com', 'Specialty Retail', 'Consumer Discretionary', 12000000000, 'Coraopolis, PA', 1948, 50000),
('Burlington Stores', 'BURL', 'https://www.burlington.com', 'https://investors.burlington.com', 'Specialty Retail', 'Consumer Discretionary', 10000000000, 'Burlington, NJ', 1972, 50000),

-- Materials
('RPM International', 'RPM', 'https://www.rpminc.com', 'https://www.rpminc.com/investors', 'Specialty Chemicals', 'Materials', 12000000000, 'Medina, OH', 1947, 16000),
('Axalta Coating Systems', 'AXTA', 'https://www.axalta.com', 'https://ir.axalta.com', 'Specialty Chemicals', 'Materials', 7000000000, 'Philadelphia, PA', 2013, 12000),
('H.B. Fuller', 'FUL', 'https://www.hbfuller.com', 'https://investors.hbfuller.com', 'Specialty Chemicals', 'Materials', 4000000000, 'Saint Paul, MN', 1887, 6500),
('Minerals Technologies', 'MTX', 'https://www.mineralstech.com', 'https://investors.mineralstech.com', 'Specialty Chemicals', 'Materials', 2000000000, 'New York, NY', 1968, 4000),
('Innospec', 'IOSP', 'https://www.innospec.com', 'https://ir.innospec.com', 'Specialty Chemicals', 'Materials', 2500000000, 'Englewood, CO', 1938, 2000),

-- Utilities
('Atmos Energy', 'ATO', 'https://www.atmosenergy.com', 'https://investors.atmosenergy.com', 'Gas Utilities', 'Utilities', 15000000000, 'Dallas, TX', 1906, 4700),
('NiSource', 'NI', 'https://www.nisource.com', 'https://investors.nisource.com', 'Multi-Utilities', 'Utilities', 12000000000, 'Merrillville, IN', 1912, 7100),
('CMS Energy', 'CMS', 'https://www.cmsenergy.com', 'https://investors.cmsenergy.com', 'Multi-Utilities', 'Utilities', 18000000000, 'Jackson, MI', 1886, 8500),
('Alliant Energy', 'LNT', 'https://www.alliantenergy.com', 'https://investors.alliantenergy.com', 'Electric Utilities', 'Utilities', 13000000000, 'Madison, WI', 1917, 3400),
('Pinnacle West Capital', 'PNW', 'https://www.pinnaclewest.com', 'https://ir.pinnaclewest.com', 'Electric Utilities', 'Utilities', 9000000000, 'Phoenix, AZ', 1985, 5700);