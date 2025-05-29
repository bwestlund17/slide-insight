/*
  # Add more S&P 500 companies

  1. Changes
    - Add another batch of S&P 500 companies
    - Include complete company information
    - Maintain data validation constraints

  2. Notes
    - Market cap values are in USD
    - All companies are part of the S&P 500 index
    - Data includes sector, industry, and other key metrics
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Technology
('Texas Instruments', 'TXN', 'https://www.ti.com', 'https://investor.ti.com', 'Semiconductors', 'Technology', 150000000000, 'Dallas, TX', 1930, 33000),
('Qualcomm', 'QCOM', 'https://www.qualcomm.com', 'https://investor.qualcomm.com', 'Semiconductors', 'Technology', 130000000000, 'San Diego, CA', 1985, 51000),
('Advanced Micro Devices', 'AMD', 'https://www.amd.com', 'https://ir.amd.com', 'Semiconductors', 'Technology', 180000000000, 'Santa Clara, CA', 1969, 25000),

-- Healthcare
('Thermo Fisher Scientific', 'TMO', 'https://www.thermofisher.com', 'https://ir.thermofisher.com', 'Medical Equipment', 'Healthcare', 200000000000, 'Waltham, MA', 1956, 130000),
('Danaher Corporation', 'DHR', 'https://www.danaher.com', 'https://investors.danaher.com', 'Medical Equipment', 'Healthcare', 180000000000, 'Washington, DC', 1969, 80000),
('Merck & Co.', 'MRK', 'https://www.merck.com', 'https://www.merck.com/investor-relations', 'Pharmaceuticals', 'Healthcare', 280000000000, 'Rahway, NJ', 1891, 68000),

-- Financial Services
('American Express', 'AXP', 'https://www.americanexpress.com', 'https://ir.americanexpress.com', 'Financial Services', 'Financial Services', 120000000000, 'New York, NY', 1850, 77300),
('BlackRock', 'BLK', 'https://www.blackrock.com', 'https://ir.blackrock.com', 'Asset Management', 'Financial Services', 110000000000, 'New York, NY', 1988, 19900),
('Charles Schwab', 'SCHW', 'https://www.schwab.com', 'https://www.aboutschwab.com/investor-relations', 'Financial Services', 'Financial Services', 100000000000, 'Westlake, TX', 1971, 35300),

-- Consumer Staples
('Walmart', 'WMT', 'https://www.walmart.com', 'https://stock.walmart.com', 'Retail', 'Consumer Staples', 410000000000, 'Bentonville, AR', 1962, 2100000),
('Costco', 'COST', 'https://www.costco.com', 'https://investor.costco.com', 'Retail', 'Consumer Staples', 240000000000, 'Issaquah, WA', 1983, 304000),
('Target', 'TGT', 'https://www.target.com', 'https://investors.target.com', 'Retail', 'Consumer Staples', 70000000000, 'Minneapolis, MN', 1902, 440000),

-- Industrials
('Honeywell', 'HON', 'https://www.honeywell.com', 'https://investor.honeywell.com', 'Industrial Conglomerates', 'Industrials', 130000000000, 'Charlotte, NC', 1906, 110000),
('Raytheon Technologies', 'RTX', 'https://www.rtx.com', 'https://investors.rtx.com', 'Aerospace & Defense', 'Industrials', 120000000000, 'Arlington, VA', 1922, 182000),
('Union Pacific', 'UNP', 'https://www.up.com', 'https://www.up.com/investor', 'Railroads', 'Industrials', 120000000000, 'Omaha, NE', 1862, 30582),

-- Energy
('ConocoPhillips', 'COP', 'https://www.conocophillips.com', 'https://www.conocophillips.com/investor-relations', 'Oil & Gas', 'Energy', 140000000000, 'Houston, TX', 1917, 9700),
('EOG Resources', 'EOG', 'https://www.eogresources.com', 'https://investors.eogresources.com', 'Oil & Gas', 'Energy', 70000000000, 'Houston, TX', 1999, 2850),
('Schlumberger', 'SLB', 'https://www.slb.com', 'https://investorcenter.slb.com', 'Oil & Gas Equipment', 'Energy', 75000000000, 'Houston, TX', 1926, 99000),

-- Materials
('Air Products', 'APD', 'https://www.airproducts.com', 'https://investors.airproducts.com', 'Chemicals', 'Materials', 60000000000, 'Allentown, PA', 1940, 20000),
('Sherwin-Williams', 'SHW', 'https://www.sherwin-williams.com', 'https://investors.sherwin-williams.com', 'Chemicals', 'Materials', 65000000000, 'Cleveland, OH', 1866, 61000),
('Nucor', 'NUE', 'https://www.nucor.com', 'https://www.nucor.com/investor-relations', 'Steel', 'Materials', 40000000000, 'Charlotte, NC', 1940, 28800),

-- Communication Services
('T-Mobile US', 'TMUS', 'https://www.t-mobile.com', 'https://investor.t-mobile.com', 'Telecommunications', 'Communication Services', 180000000000, 'Bellevue, WA', 1994, 71000),
('AT&T', 'T', 'https://www.att.com', 'https://investors.att.com', 'Telecommunications', 'Communication Services', 120000000000, 'Dallas, TX', 1885, 160700),
('Verizon', 'VZ', 'https://www.verizon.com', 'https://www.verizon.com/about/investors', 'Telecommunications', 'Communication Services', 150000000000, 'New York, NY', 1983, 117100),

-- Consumer Discretionary
('Home Depot', 'HD', 'https://www.homedepot.com', 'https://ir.homedepot.com', 'Home Improvement Retail', 'Consumer Discretionary', 310000000000, 'Atlanta, GA', 1978, 471600),
('Lowe''s', 'LOW', 'https://www.lowes.com', 'https://ir.lowes.com', 'Home Improvement Retail', 'Consumer Discretionary', 130000000000, 'Mooresville, NC', 1921, 244500),
('TJX Companies', 'TJX', 'https://www.tjx.com', 'https://investor.tjx.com', 'Retail', 'Consumer Discretionary', 95000000000, 'Framingham, MA', 1956, 329000);