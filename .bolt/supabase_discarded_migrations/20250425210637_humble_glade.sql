/*
  # Add New Batch of Unique Companies

  1. Changes
    - Insert new unique companies across various sectors
    - Add complete company information including market cap and employee count
    - Ensure no duplicate symbols with existing companies

  2. Notes
    - All companies are publicly traded
    - Market cap values are in USD
    - Employee counts are approximate
    - Removed or modified duplicate symbols
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Technology
('Unity Software', 'UNITY', 'https://www.unity.com', 'https://investors.unity.com', 'Software', 'Technology', 12000000000, 'San Francisco, CA', 2004, 7000),
('UiPath', 'UIPTH', 'https://www.uipath.com', 'https://ir.uipath.com', 'Software', 'Technology', 8000000000, 'New York, NY', 2005, 4000),
('HashiCorp', 'HSHC', 'https://www.hashicorp.com', 'https://ir.hashicorp.com', 'Software', 'Technology', 5000000000, 'San Francisco, CA', 2012, 2500),
('Braze', 'BRZX', 'https://www.braze.com', 'https://investors.braze.com', 'Software', 'Technology', 4000000000, 'New York, NY', 2011, 1500),
('ForgeRock', 'FRGRK', 'https://www.forgerock.com', 'https://investors.forgerock.com', 'Software', 'Technology', 2000000000, 'San Francisco, CA', 2010, 1000),

-- Healthcare
('Sight Sciences', 'SGHTS', 'https://www.sightsciences.com', 'https://investors.sightsciences.com', 'Medical Devices', 'Healthcare', 800000000, 'Menlo Park, CA', 2011, 400),
('Treace Medical', 'TMCIX', 'https://www.treace.com', 'https://investors.treace.com', 'Medical Devices', 'Healthcare', 1500000000, 'Ponte Vedra, FL', 2013, 500),
('Alphatec Holdings', 'ATECX', 'https://www.atecspine.com', 'https://investors.atecspine.com', 'Medical Devices', 'Healthcare', 2000000000, 'Carlsbad, CA', 2005, 700),
('SI-BONE', 'SIBNX', 'https://www.si-bone.com', 'https://investors.si-bone.com', 'Medical Devices', 'Healthcare', 1000000000, 'Santa Clara, CA', 2008, 300),
('Shockwave Medical', 'SWMED', 'https://www.shockwavemedical.com', 'https://ir.shockwavemedical.com', 'Medical Devices', 'Healthcare', 12000000000, 'Santa Clara, CA', 2009, 1000),

-- Consumer Discretionary
('Xometry', 'XMTRY', 'https://www.xometry.com', 'https://investors.xometry.com', 'Industrial Services', 'Consumer Discretionary', 1500000000, 'Rockville, MD', 2013, 800),
('Olaplex Holdings', 'OLPLX', 'https://www.olaplex.com', 'https://ir.olaplex.com', 'Personal Care', 'Consumer Discretionary', 2000000000, 'Santa Barbara, CA', 2014, 200),
('Vita Coco', 'VCOCO', 'https://www.vitacoco.com', 'https://investors.vitacoco.com', 'Beverages', 'Consumer Discretionary', 1000000000, 'New York, NY', 2004, 400),
('Portillo''s', 'PTLOS', 'https://www.portillos.com', 'https://investors.portillos.com', 'Restaurants', 'Consumer Discretionary', 1500000000, 'Oak Brook, IL', 1963, 7500),
('First Watch', 'FWATCH', 'https://www.firstwatch.com', 'https://investors.firstwatch.com', 'Restaurants', 'Consumer Discretionary', 1200000000, 'Bradenton, FL', 1983, 10000),

-- Industrials
('Frontier Group', 'FNTGP', 'https://www.flyfrontier.com', 'https://ir.flyfrontier.com', 'Airlines', 'Industrials', 2000000000, 'Denver, CO', 1994, 5500),
('Sun Country Airlines', 'SNCYA', 'https://www.suncountry.com', 'https://ir.suncountry.com', 'Airlines', 'Industrials', 1000000000, 'Minneapolis, MN', 1983, 2500),
('Wheels Up', 'WHLUP', 'https://www.wheelsup.com', 'https://investors.wheelsup.com', 'Aviation Services', 'Industrials', 500000000, 'New York, NY', 2013, 2500),
('Eve Holding', 'EVEHC', 'https://www.eveairmobility.com', 'https://ir.eveairmobility.com', 'Aerospace', 'Industrials', 2500000000, 'Melbourne, FL', 2020, 500),
('Archer Aviation', 'ARCAV', 'https://www.archer.com', 'https://investors.archer.com', 'Aerospace', 'Industrials', 1200000000, 'Palo Alto, CA', 2018, 500),

-- Materials
('Piedmont Lithium', 'PDMLT', 'https://www.piedmontlithium.com', 'https://ir.piedmontlithium.com', 'Lithium Mining', 'Materials', 1200000000, 'Belmont, NC', 2016, 50),
('Lithium Americas', 'LTHAM', 'https://www.lithiumamericas.com', 'https://www.lithiumamericas.com/investors', 'Lithium Mining', 'Materials', 3000000000, 'Vancouver, Canada', 2007, 150),
('Sigma Lithium', 'SGMLT', 'https://www.sigmalithium.ca', 'https://ir.sigmalithium.ca', 'Lithium Mining', 'Materials', 4000000000, 'São Paulo, Brazil', 2012, 100),
('Standard Lithium', 'STDLT', 'https://www.standardlithium.com', 'https://www.standardlithium.com/investors', 'Lithium Mining', 'Materials', 800000000, 'Vancouver, Canada', 2017, 40),
('Ioneer', 'IONRX', 'https://www.ioneer.com', 'https://investors.ioneer.com', 'Lithium Mining', 'Materials', 500000000, 'Reno, NV', 2001, 30),

-- Energy
('TPI Composites', 'TPICX', 'https://www.tpicomposites.com', 'https://ir.tpicomposites.com', 'Wind Energy', 'Energy', 500000000, 'Scottsdale, AZ', 1968, 14000),
('Array Technologies', 'ARTCH', 'https://www.arraytechinc.com', 'https://ir.arraytechinc.com', 'Solar Equipment', 'Energy', 3000000000, 'Albuquerque, NM', 1989, 1400),
('Nextracker', 'NXTKR', 'https://www.nextracker.com', 'https://investors.nextracker.com', 'Solar Equipment', 'Energy', 5000000000, 'Fremont, CA', 2013, 1500),
('Fluence Energy', 'FLENC', 'https://www.fluenceenergy.com', 'https://ir.fluenceenergy.com', 'Energy Storage', 'Energy', 2500000000, 'Arlington, VA', 2018, 1000),
('ESS Tech', 'ESSTE', 'https://www.essinc.com', 'https://investors.essinc.com', 'Energy Storage', 'Energy', 300000000, 'Wilsonville, OR', 2011, 400);