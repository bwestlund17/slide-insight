/*
  # Add third batch of S&P 500 companies

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
('ServiceNow', 'NOW', 'https://www.servicenow.com', 'https://investors.servicenow.com', 'Software', 'Technology', 120000000000, 'Santa Clara, CA', 2004, 20000),
('Intuit', 'INTU', 'https://www.intuit.com', 'https://investors.intuit.com', 'Software', 'Technology', 140000000000, 'Mountain View, CA', 1983, 17300),
('Autodesk', 'ADSK', 'https://www.autodesk.com', 'https://investors.autodesk.com', 'Software', 'Technology', 45000000000, 'San Francisco, CA', 1982, 12600),
('Synopsys', 'SNPS', 'https://www.synopsys.com', 'https://investor.synopsys.com', 'Software', 'Technology', 70000000000, 'Mountain View, CA', 1986, 19000),
('Cadence Design', 'CDNS', 'https://www.cadence.com', 'https://ir.cadence.com', 'Software', 'Technology', 65000000000, 'San Jose, CA', 1988, 9300),

-- Healthcare
('Vertex Pharmaceuticals', 'VRTX', 'https://www.vrtx.com', 'https://investors.vrtx.com', 'Biotechnology', 'Healthcare', 100000000000, 'Boston, MA', 1989, 4000),
('Regeneron', 'REGN', 'https://www.regeneron.com', 'https://investor.regeneron.com', 'Biotechnology', 'Healthcare', 90000000000, 'Tarrytown, NY', 1988, 11000),
('Gilead Sciences', 'GILD', 'https://www.gilead.com', 'https://investors.gilead.com', 'Biotechnology', 'Healthcare', 95000000000, 'Foster City, CA', 1987, 17000),
('Amgen', 'AMGN', 'https://www.amgen.com', 'https://investors.amgen.com', 'Biotechnology', 'Healthcare', 130000000000, 'Thousand Oaks, CA', 1980, 24200),
('Biogen', 'BIIB', 'https://www.biogen.com', 'https://investors.biogen.com', 'Biotechnology', 'Healthcare', 35000000000, 'Cambridge, MA', 1978, 9100),

-- Financial Services
('S&P Global', 'SPGI', 'https://www.spglobal.com', 'https://investor.spglobal.com', 'Financial Information', 'Financial Services', 130000000000, 'New York, NY', 1860, 35000),
('CME Group', 'CME', 'https://www.cmegroup.com', 'https://investor.cmegroup.com', 'Financial Exchanges', 'Financial Services', 70000000000, 'Chicago, IL', 1898, 3600),
('Intercontinental Exchange', 'ICE', 'https://www.ice.com', 'https://ir.theice.com', 'Financial Exchanges', 'Financial Services', 65000000000, 'Atlanta, GA', 2000, 8900),
('Moody''s', 'MCO', 'https://www.moodys.com', 'https://ir.moodys.com', 'Financial Services', 'Financial Services', 60000000000, 'New York, NY', 1909, 14000),
('Marsh & McLennan', 'MMC', 'https://www.mmc.com', 'https://investor.mmc.com', 'Insurance Brokers', 'Financial Services', 95000000000, 'New York, NY', 1871, 83000),

-- Consumer Staples
('Mondelez International', 'MDLZ', 'https://www.mondelezinternational.com', 'https://ir.mondelezinternational.com', 'Food Products', 'Consumer Staples', 95000000000, 'Chicago, IL', 2012, 80000),
('Colgate-Palmolive', 'CL', 'https://www.colgatepalmolive.com', 'https://investor.colgatepalmolive.com', 'Personal Products', 'Consumer Staples', 65000000000, 'New York, NY', 1806, 34500),
('Kimberly-Clark', 'KMB', 'https://www.kimberly-clark.com', 'https://investor.kimberly-clark.com', 'Personal Products', 'Consumer Staples', 45000000000, 'Dallas, TX', 1872, 45000),
('General Mills', 'GIS', 'https://www.generalmills.com', 'https://investors.generalmills.com', 'Food Products', 'Consumer Staples', 40000000000, 'Minneapolis, MN', 1866, 32500),
('Kellogg Company', 'K', 'https://www.kelloggs.com', 'https://investor.kelloggs.com', 'Food Products', 'Consumer Staples', 25000000000, 'Battle Creek, MI', 1906, 31000),

-- Industrials
('Deere & Company', 'DE', 'https://www.deere.com', 'https://investor.deere.com', 'Farm & Construction Machinery', 'Industrials', 110000000000, 'Moline, IL', 1837, 75000),
('Illinois Tool Works', 'ITW', 'https://www.itw.com', 'https://investor.itw.com', 'Industrial Machinery', 'Industrials', 70000000000, 'Glenview, IL', 1912, 45000),
('Parker-Hannifin', 'PH', 'https://www.parker.com', 'https://investors.parker.com', 'Industrial Machinery', 'Industrials', 45000000000, 'Cleveland, OH', 1917, 55000),
('Emerson Electric', 'EMR', 'https://www.emerson.com', 'https://www.emerson.com/en-us/investors', 'Electrical Equipment', 'Industrials', 55000000000, 'St. Louis, MO', 1890, 85000),
('Eaton Corporation', 'ETN', 'https://www.eaton.com', 'https://www.eaton.com/us/en-us/company/investor-relations.html', 'Industrial Machinery', 'Industrials', 65000000000, 'Dublin, Ireland', 1911, 85000),

-- Energy
('Phillips 66', 'PSX', 'https://www.phillips66.com', 'https://investor.phillips66.com', 'Oil & Gas Refining', 'Energy', 45000000000, 'Houston, TX', 2012, 14000),
('Valero Energy', 'VLO', 'https://www.valero.com', 'https://investorvalero.com', 'Oil & Gas Refining', 'Energy', 40000000000, 'San Antonio, TX', 1980, 10000),
('Marathon Petroleum', 'MPC', 'https://www.marathonpetroleum.com', 'https://ir.marathonpetroleum.com', 'Oil & Gas Refining', 'Energy', 55000000000, 'Findlay, OH', 2011, 17800),
('Kinder Morgan', 'KMI', 'https://www.kindermorgan.com', 'https://ir.kindermorgan.com', 'Oil & Gas Storage', 'Energy', 40000000000, 'Houston, TX', 1997, 10900),
('Williams Companies', 'WMB', 'https://www.williams.com', 'https://investor.williams.com', 'Oil & Gas Storage', 'Energy', 35000000000, 'Tulsa, OK', 1908, 4900);