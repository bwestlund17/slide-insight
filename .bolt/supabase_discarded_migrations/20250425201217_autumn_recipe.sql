/*
  # Add eighth batch of S&P 500 companies

  1. Changes
    - Add another batch of unique S&P 500 companies
    - Include complete company information
    - Maintain data validation constraints

  2. Notes
    - Market cap values are in USD
    - All companies are part of the S&P 500 index
    - Data includes sector, industry, and other key metrics
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Technology
('Snowflake', 'SNOW', 'https://www.snowflake.com', 'https://investors.snowflake.com', 'Software', 'Technology', 55000000000, 'Bozeman, MT', 2012, 5900),
('MongoDB', 'MDB', 'https://www.mongodb.com', 'https://investors.mongodb.com', 'Software', 'Technology', 35000000000, 'New York, NY', 2007, 4300),
('Splunk', 'SPLK', 'https://www.splunk.com', 'https://investors.splunk.com', 'Software', 'Technology', 25000000000, 'San Francisco, CA', 2003, 7500),
('Palantir', 'PLTR', 'https://www.palantir.com', 'https://investors.palantir.com', 'Software', 'Technology', 45000000000, 'Denver, CO', 2003, 3800),
('Zscaler', 'ZS', 'https://www.zscaler.com', 'https://ir.zscaler.com', 'Cybersecurity', 'Technology', 25000000000, 'San Jose, CA', 2007, 4900),

-- Healthcare
('Intuitive Surgical', 'ISRG', 'https://www.intuitive.com', 'https://isrg.intuitive.com', 'Medical Devices', 'Healthcare', 110000000000, 'Sunnyvale, CA', 1995, 12000),
('Boston Scientific', 'BSX', 'https://www.bostonscientific.com', 'https://investors.bostonscientific.com', 'Medical Devices', 'Healthcare', 85000000000, 'Marlborough, MA', 1979, 45000),
('Stryker', 'SYK', 'https://www.stryker.com', 'https://investors.stryker.com', 'Medical Devices', 'Healthcare', 95000000000, 'Kalamazoo, MI', 1941, 51000),
('Zimmer Biomet', 'ZBH', 'https://www.zimmerbiomet.com', 'https://investor.zimmerbiomet.com', 'Medical Devices', 'Healthcare', 25000000000, 'Warsaw, IN', 1927, 20000),
('Cooper Companies', 'COO', 'https://www.coopercos.com', 'https://investor.coopercos.com', 'Medical Devices', 'Healthcare', 20000000000, 'San Ramon, CA', 1958, 14000),

-- Consumer Staples
('Estée Lauder', 'EL', 'https://www.elcompanies.com', 'https://investors.elcompanies.com', 'Personal Products', 'Consumer Staples', 65000000000, 'New York, NY', 1946, 62000),
('Clorox', 'CLX', 'https://www.thecloroxcompany.com', 'https://investors.thecloroxcompany.com', 'Household Products', 'Consumer Staples', 15000000000, 'Oakland, CA', 1913, 9000),
('Church & Dwight', 'CHD', 'https://www.churchdwight.com', 'https://investor.churchdwight.com', 'Household Products', 'Consumer Staples', 25000000000, 'Ewing, NJ', 1846, 5100),
('Hormel Foods', 'HRL', 'https://www.hormelfoods.com', 'https://investor.hormelfoods.com', 'Food Products', 'Consumer Staples', 20000000000, 'Austin, MN', 1891, 20000),
('J.M. Smucker', 'SJM', 'https://www.jmsmucker.com', 'https://investors.jmsmucker.com', 'Food Products', 'Consumer Staples', 15000000000, 'Orrville, OH', 1897, 7100),

-- Utilities
('Sempra Energy', 'SRE', 'https://www.sempra.com', 'https://investors.sempra.com', 'Multi-Utilities', 'Utilities', 45000000000, 'San Diego, CA', 1998, 20000),
('American Electric Power', 'AEP', 'https://www.aep.com', 'https://investors.aep.com', 'Electric Utilities', 'Utilities', 40000000000, 'Columbus, OH', 1906, 16700),
('Xcel Energy', 'XEL', 'https://www.xcelenergy.com', 'https://investors.xcelenergy.com', 'Electric Utilities', 'Utilities', 35000000000, 'Minneapolis, MN', 1909, 11500),
('Consolidated Edison', 'ED', 'https://www.coned.com', 'https://investor.conedison.com', 'Electric Utilities', 'Utilities', 30000000000, 'New York, NY', 1823, 14000),
('WEC Energy Group', 'WEC', 'https://www.wecenergygroup.com', 'https://investors.wecenergygroup.com', 'Electric Utilities', 'Utilities', 25000000000, 'Milwaukee, WI', 1896, 7000),

-- Communication Services
('Electronic Arts', 'EA', 'https://www.ea.com', 'https://ir.ea.com', 'Video Games', 'Communication Services', 35000000000, 'Redwood City, CA', 1982, 12900),
('Take-Two Interactive', 'TTWO', 'https://www.take2games.com', 'https://ir.take2games.com', 'Video Games', 'Communication Services', 25000000000, 'New York, NY', 1993, 8000),
('Warner Bros. Discovery', 'WBD', 'https://wbd.com', 'https://ir.wbd.com', 'Media', 'Communication Services', 30000000000, 'New York, NY', 2022, 37000),
('Fox Corporation', 'FOXA', 'https://www.foxcorporation.com', 'https://investor.foxcorporation.com', 'Media', 'Communication Services', 15000000000, 'New York, NY', 2019, 10600),
('Paramount Global', 'PARA', 'https://www.paramount.com', 'https://ir.paramount.com', 'Media', 'Communication Services', 10000000000, 'New York, NY', 2019, 24500),

-- Energy
('Pioneer Natural Resources', 'PXD', 'https://www.pxd.com', 'https://investors.pxd.com', 'Oil & Gas E&P', 'Energy', 55000000000, 'Irving, TX', 1997, 2300),
('Devon Energy', 'DVN', 'https://www.devonenergy.com', 'https://investors.devonenergy.com', 'Oil & Gas E&P', 'Energy', 30000000000, 'Oklahoma City, OK', 1971, 1800),
('Diamondback Energy', 'FANG', 'https://www.diamondbackenergy.com', 'https://ir.diamondbackenergy.com', 'Oil & Gas E&P', 'Energy', 25000000000, 'Midland, TX', 2007, 1000),
('Marathon Oil', 'MRO', 'https://www.marathonoil.com', 'https://ir.marathonoil.com', 'Oil & Gas E&P', 'Energy', 15000000000, 'Houston, TX', 1887, 1700),
('APA Corporation', 'APA', 'https://www.apacorp.com', 'https://investor.apacorp.com', 'Oil & Gas E&P', 'Energy', 12000000000, 'Houston, TX', 1954, 2000);