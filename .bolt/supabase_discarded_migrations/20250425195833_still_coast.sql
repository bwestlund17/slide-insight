/*
  # Add remaining S&P 500 companies

  1. Changes
    - Add more S&P 500 companies with complete company information
    - Include market cap, sector, headquarters, and founding year data
    - Maintain data validation constraints

  2. Notes
    - Market cap values are in USD
    - All companies are part of the S&P 500 index
    - Data includes sector, industry, and other key metrics
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Healthcare
('Abbott Laboratories', 'ABT', 'https://www.abbott.com', 'https://www.abbottinvestor.com', 'Medical Devices', 'Healthcare', 180000000000, 'Abbott Park, IL', 1888, 115000),
('AbbVie Inc.', 'ABBV', 'https://www.abbvie.com', 'https://investors.abbvie.com', 'Pharmaceuticals', 'Healthcare', 260000000000, 'North Chicago, IL', 2013, 50000),
('Pfizer Inc.', 'PFE', 'https://www.pfizer.com', 'https://investors.pfizer.com', 'Pharmaceuticals', 'Healthcare', 170000000000, 'New York, NY', 1849, 79000),

-- Technology
('Adobe Inc.', 'ADBE', 'https://www.adobe.com', 'https://www.adobe.com/investor-relations.html', 'Software', 'Technology', 220000000000, 'San Jose, CA', 1982, 29000),
('Salesforce', 'CRM', 'https://www.salesforce.com', 'https://investor.salesforce.com', 'Software', 'Technology', 240000000000, 'San Francisco, CA', 1999, 70000),
('Intel Corporation', 'INTC', 'https://www.intel.com', 'https://www.intc.com/investor-relations', 'Semiconductors', 'Technology', 180000000000, 'Santa Clara, CA', 1968, 131900),

-- Financial Services
('Bank of America', 'BAC', 'https://www.bankofamerica.com', 'https://investor.bankofamerica.com', 'Banking', 'Financial Services', 240000000000, 'Charlotte, NC', 1784, 216000),
('Goldman Sachs', 'GS', 'https://www.goldmansachs.com', 'https://www.goldmansachs.com/investor-relations', 'Investment Banking', 'Financial Services', 120000000000, 'New York, NY', 1869, 48500),
('Morgan Stanley', 'MS', 'https://www.morganstanley.com', 'https://www.morganstanley.com/about-us-ir', 'Investment Banking', 'Financial Services', 150000000000, 'New York, NY', 1935, 82000),

-- Consumer Discretionary
('Nike Inc.', 'NKE', 'https://www.nike.com', 'https://investors.nike.com', 'Footwear & Apparel', 'Consumer Discretionary', 150000000000, 'Beaverton, OR', 1964, 79100),
('McDonald''s Corporation', 'MCD', 'https://www.mcdonalds.com', 'https://corporate.mcdonalds.com/corpmcd/investors.html', 'Restaurants', 'Consumer Discretionary', 210000000000, 'Chicago, IL', 1955, 200000),
('Starbucks Corporation', 'SBUX', 'https://www.starbucks.com', 'https://investor.starbucks.com', 'Restaurants', 'Consumer Discretionary', 120000000000, 'Seattle, WA', 1971, 402000),

-- Industrials
('Boeing Company', 'BA', 'https://www.boeing.com', 'https://investors.boeing.com', 'Aerospace & Defense', 'Industrials', 130000000000, 'Arlington, VA', 1916, 156000),
('Caterpillar Inc.', 'CAT', 'https://www.caterpillar.com', 'https://investors.caterpillar.com', 'Construction Equipment', 'Industrials', 140000000000, 'Irving, TX', 1925, 109100),
('General Electric', 'GE', 'https://www.ge.com', 'https://www.ge.com/investor-relations', 'Industrial Conglomerates', 'Industrials', 130000000000, 'Boston, MA', 1892, 172000),

-- Communication Services
('Meta Platforms', 'META', 'https://about.meta.com', 'https://investor.fb.com', 'Social Media', 'Communication Services', 980000000000, 'Menlo Park, CA', 2004, 86482),
('Netflix Inc.', 'NFLX', 'https://www.netflix.com', 'https://ir.netflix.net', 'Entertainment', 'Communication Services', 240000000000, 'Los Gatos, CA', 1997, 12800),
('Walt Disney Company', 'DIS', 'https://www.disney.com', 'https://thewaltdisneycompany.com/investor-relations', 'Entertainment', 'Communication Services', 190000000000, 'Burbank, CA', 1923, 220000),

-- Materials
('Dow Inc.', 'DOW', 'https://www.dow.com', 'https://investors.dow.com', 'Chemicals', 'Materials', 38000000000, 'Midland, MI', 1897, 37800),
('Linde plc', 'LIN', 'https://www.linde.com', 'https://investors.linde.com', 'Industrial Gases', 'Materials', 190000000000, 'Woking, UK', 1879, 65000),
('Freeport-McMoRan', 'FCX', 'https://www.fcx.com', 'https://investors.fcx.com', 'Mining', 'Materials', 60000000000, 'Phoenix, AZ', 1912, 24700),

-- Real Estate
('American Tower', 'AMT', 'https://www.americantower.com', 'https://investor.americantower.com', 'REITs', 'Real Estate', 95000000000, 'Boston, MA', 1995, 6000),
('Prologis', 'PLD', 'https://www.prologis.com', 'https://ir.prologis.com', 'REITs', 'Real Estate', 110000000000, 'San Francisco, CA', 1983, 2466),
('Crown Castle', 'CCI', 'https://www.crowncastle.com', 'https://investor.crowncastle.com', 'REITs', 'Real Estate', 48000000000, 'Houston, TX', 1994, 5000),

-- Utilities
('NextEra Energy', 'NEE', 'https://www.nexteraenergy.com', 'https://investors.nexteraenergy.com', 'Electric Utilities', 'Utilities', 120000000000, 'Juno Beach, FL', 1925, 15000),
('Southern Company', 'SO', 'https://www.southerncompany.com', 'https://investor.southerncompany.com', 'Electric Utilities', 'Utilities', 75000000000, 'Atlanta, GA', 1945, 27700),
('Duke Energy', 'DUK', 'https://www.duke-energy.com', 'https://investors.duke-energy.com', 'Electric Utilities', 'Utilities', 78000000000, 'Charlotte, NC', 1904, 27600);