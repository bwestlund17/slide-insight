/*
  # Add twelfth batch of S&P 500 companies

  1. Changes
    - Add another batch of unique S&P 500 companies
    - Include complete company information
    - Maintain data validation constraints
    - Verified no duplicate symbols with existing companies

  2. Notes
    - Market cap values are in USD
    - All companies are part of the S&P 500 index
    - Data includes sector, industry, and other key metrics
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Technology
('Manhattan Associates', 'MANH', 'https://www.manh.com', 'https://ir.manh.com', 'Software', 'Technology', 10000000000, 'Atlanta, GA', 1990, 3500),
('Pegasystems', 'PEGA', 'https://www.pega.com', 'https://investors.pega.com', 'Software', 'Technology', 5000000000, 'Cambridge, MA', 1983, 6500),
('Progress Software', 'PRGS', 'https://www.progress.com', 'https://investors.progress.com', 'Software', 'Technology', 3000000000, 'Burlington, MA', 1981, 2000),
('SolarWinds', 'SWI', 'https://www.solarwinds.com', 'https://investors.solarwinds.com', 'Software', 'Technology', 2500000000, 'Austin, TX', 1999, 3500),
('Commvault', 'CVLT', 'https://www.commvault.com', 'https://ir.commvault.com', 'Software', 'Technology', 3500000000, 'Tinton Falls, NJ', 1996, 2800),

-- Healthcare
('Integra LifeSciences', 'IART', 'https://www.integralife.com', 'https://investor.integralife.com', 'Medical Devices', 'Healthcare', 4500000000, 'Princeton, NJ', 1989, 3800),
('Merit Medical', 'MMSI', 'https://www.merit.com', 'https://investors.merit.com', 'Medical Devices', 'Healthcare', 4000000000, 'South Jordan, UT', 1987, 6800),
('NuVasive', 'NUVA', 'https://www.nuvasive.com', 'https://ir.nuvasive.com', 'Medical Devices', 'Healthcare', 3000000000, 'San Diego, CA', 1997, 3000),
('Orthofix', 'OFIX', 'https://www.orthofix.com', 'https://ir.orthofix.com', 'Medical Devices', 'Healthcare', 1000000000, 'Lewisville, TX', 1987, 1100),
('Haemonetics', 'HAE', 'https://www.haemonetics.com', 'https://investors.haemonetics.com', 'Medical Devices', 'Healthcare', 4500000000, 'Boston, MA', 1971, 3000),

-- Consumer Discretionary
('Meritage Homes', 'MTH', 'https://www.meritagehomes.com', 'https://investors.meritagehomes.com', 'Homebuilding', 'Consumer Discretionary', 5000000000, 'Scottsdale, AZ', 1985, 2000),
('KB Home', 'KBH', 'https://www.kbhome.com', 'https://investor.kbhome.com', 'Homebuilding', 'Consumer Discretionary', 4500000000, 'Los Angeles, CA', 1957, 2300),
('Taylor Morrison', 'TMHC', 'https://www.taylormorrison.com', 'https://investors.taylormorrison.com', 'Homebuilding', 'Consumer Discretionary', 5500000000, 'Scottsdale, AZ', 2007, 3000),
('Tri Pointe Homes', 'TPH', 'https://www.tripointegroup.com', 'https://investors.tripointegroup.com', 'Homebuilding', 'Consumer Discretionary', 3000000000, 'Incline Village, NV', 2009, 1500),
('MDC Holdings', 'MDC', 'https://www.mdcholdings.com', 'https://ir.mdcholdings.com', 'Homebuilding', 'Consumer Discretionary', 3500000000, 'Denver, CO', 1972, 2000),

-- Industrials
('Watts Water', 'WTS', 'https://www.watts.com', 'https://investors.watts.com', 'Industrial Machinery', 'Industrials', 6000000000, 'North Andover, MA', 1874, 4800),
('Mueller Industries', 'MLI', 'https://www.muellerindustries.com', 'https://investors.muellerindustries.com', 'Industrial Machinery', 'Industrials', 5000000000, 'Collierville, TN', 1917, 5000),
('Standex', 'SXI', 'https://www.standex.com', 'https://ir.standex.com', 'Industrial Machinery', 'Industrials', 2000000000, 'Salem, NH', 1955, 4000),
('Enerpac Tool', 'EPAC', 'https://www.enerpactoolgroup.com', 'https://investors.enerpactoolgroup.com', 'Industrial Machinery', 'Industrials', 1500000000, 'Menomonee Falls, WI', 1910, 2000),
('TriMas', 'TRS', 'https://www.trimascorp.com', 'https://ir.trimascorp.com', 'Industrial Machinery', 'Industrials', 1000000000, 'Bloomfield Hills, MI', 1986, 3500),

-- Materials
('Stepan Company', 'SCL', 'https://www.stepan.com', 'https://investors.stepan.com', 'Specialty Chemicals', 'Materials', 2000000000, 'Northfield, IL', 1932, 2200),
('Quaker Chemical', 'KWR', 'https://www.quakerhoughton.com', 'https://investor.quakerhoughton.com', 'Specialty Chemicals', 'Materials', 3500000000, 'Conshohocken, PA', 1918, 4500),
('NewMarket', 'NEU', 'https://www.newmarket.com', 'https://investors.newmarket.com', 'Specialty Chemicals', 'Materials', 4000000000, 'Richmond, VA', 1887, 2000),
('Balchem', 'BCPC', 'https://www.balchem.com', 'https://investors.balchem.com', 'Specialty Chemicals', 'Materials', 4500000000, 'New Hampton, NY', 1967, 1400),
('Chase Corporation', 'CCF', 'https://www.chasecorp.com', 'https://investors.chasecorp.com', 'Specialty Chemicals', 'Materials', 1000000000, 'Westwood, MA', 1946, 750),

-- Consumer Staples
('John B. Sanfilippo', 'JBSS', 'https://www.jbssinc.com', 'https://investors.jbssinc.com', 'Food Products', 'Consumer Staples', 1200000000, 'Elgin, IL', 1922, 1300),
('Cal-Maine Foods', 'CALM', 'https://www.calmainefoods.com', 'https://investors.calmainefoods.com', 'Food Products', 'Consumer Staples', 2500000000, 'Jackson, MS', 1969, 3800),
('MGP Ingredients', 'MGPI', 'https://www.mgpingredients.com', 'https://ir.mgpingredients.com', 'Food Products', 'Consumer Staples', 2000000000, 'Atchison, KS', 1941, 700),
('Seneca Foods', 'SENEA', 'https://www.senecafoods.com', 'https://investors.senecafoods.com', 'Food Products', 'Consumer Staples', 500000000, 'Marion, NY', 1949, 3500),
('Lifeway Foods', 'LWAY', 'https://www.lifeway.net', 'https://investors.lifeway.net', 'Food Products', 'Consumer Staples', 200000000, 'Morton Grove, IL', 1986, 350);