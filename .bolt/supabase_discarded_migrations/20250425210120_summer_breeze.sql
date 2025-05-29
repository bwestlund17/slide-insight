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
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Technology
('Bentley Systems', 'BSY', 'https://www.bentley.com', 'https://investors.bentley.com', 'Software', 'Technology', 15000000000, 'Exton, PA', 1984, 4500),
('N-able', 'NABL', 'https://www.n-able.com', 'https://investors.n-able.com', 'Software', 'Technology', 2500000000, 'Durham, NC', 2000, 1200),
('Jamf Holding', 'JAMF', 'https://www.jamf.com', 'https://ir.jamf.com', 'Software', 'Technology', 3000000000, 'Minneapolis, MN', 2002, 2500),
('Freshworks', 'FRSH', 'https://www.freshworks.com', 'https://ir.freshworks.com', 'Software', 'Technology', 5000000000, 'San Mateo, CA', 2010, 5200),
('GitLab', 'GTLB', 'https://www.gitlab.com', 'https://ir.gitlab.com', 'Software', 'Technology', 8000000000, 'San Francisco, CA', 2014, 1800),

-- Healthcare
('Alignment Healthcare', 'ALHC', 'https://www.alignmenthealthcare.com', 'https://ir.alignmenthealthcare.com', 'Healthcare Services', 'Healthcare', 2000000000, 'Orange, CA', 2013, 1000),
('Privia Health', 'PRVA', 'https://www.priviahealth.com', 'https://ir.priviahealth.com', 'Healthcare Services', 'Healthcare', 4000000000, 'Arlington, VA', 2007, 800),
('Agilon Health', 'AGL', 'https://www.agilonhealth.com', 'https://investors.agilonhealth.com', 'Healthcare Services', 'Healthcare', 8000000000, 'Austin, TX', 2016, 1000),
('Lifestance Health', 'LFST', 'https://www.lifestance.com', 'https://investor.lifestance.com', 'Healthcare Services', 'Healthcare', 2500000000, 'Scottsdale, AZ', 2017, 5000),
('Cue Health', 'HLTH', 'https://www.cuehealth.com', 'https://investors.cuehealth.com', 'Medical Devices', 'Healthcare', 500000000, 'San Diego, CA', 2010, 1500),

-- Consumer Discretionary
('Rover Group', 'ROVR', 'https://www.rover.com', 'https://investors.rover.com', 'Consumer Services', 'Consumer Discretionary', 1000000000, 'Seattle, WA', 2011, 500),
('Vroom', 'VRM', 'https://www.vroom.com', 'https://ir.vroom.com', 'E-Commerce', 'Consumer Discretionary', 500000000, 'New York, NY', 2013, 1500),
('ThredUp', 'TDUP', 'https://www.thredup.com', 'https://ir.thredup.com', 'E-Commerce', 'Consumer Discretionary', 300000000, 'Oakland, CA', 2009, 2000),
('The RealReal', 'REAL', 'https://www.therealreal.com', 'https://investor.therealreal.com', 'E-Commerce', 'Consumer Discretionary', 400000000, 'San Francisco, CA', 2011, 3000),
('Poshmark', 'POSH', 'https://www.poshmark.com', 'https://investors.poshmark.com', 'E-Commerce', 'Consumer Discretionary', 1200000000, 'Redwood City, CA', 2011, 800),

-- Industrials
('Proterra', 'PTRA', 'https://www.proterra.com', 'https://ir.proterra.com', 'Electric Vehicles', 'Industrials', 800000000, 'Burlingame, CA', 2004, 800),
('Lightning eMotors', 'ZEV', 'https://lightningemotors.com', 'https://investors.lightningemotors.com', 'Electric Vehicles', 'Industrials', 200000000, 'Loveland, CO', 2008, 300),
('Hyzon Motors', 'HYZN', 'https://www.hyzonmotors.com', 'https://ir.hyzonmotors.com', 'Electric Vehicles', 'Industrials', 300000000, 'Rochester, NY', 2020, 200),
('Nikola', 'NKLA', 'https://www.nikolamotor.com', 'https://nikolamotor.com/investors', 'Electric Vehicles', 'Industrials', 1500000000, 'Phoenix, AZ', 2015, 1500),
('Workhorse Group', 'WKHS', 'https://www.workhorse.com', 'https://ir.workhorse.com', 'Electric Vehicles', 'Industrials', 400000000, 'Cincinnati, OH', 2007, 400),

-- Materials
('Piedmont Lithium', 'PLL2', 'https://www.piedmontlithium.com', 'https://ir.piedmontlithium.com', 'Lithium Mining', 'Materials', 1200000000, 'Belmont, NC', 2016, 50),
('Standard Lithium', 'SLI', 'https://www.standardlithium.com', 'https://www.standardlithium.com/investors', 'Lithium Mining', 'Materials', 800000000, 'Vancouver, Canada', 2017, 40),
('Sigma Lithium', 'SGML', 'https://www.sigmalithium.ca', 'https://ir.sigmalithium.ca', 'Lithium Mining', 'Materials', 4000000000, 'São Paulo, Brazil', 2012, 100),
('Lithium Americas', 'LAC', 'https://www.lithiumamericas.com', 'https://www.lithiumamericas.com/investors', 'Lithium Mining', 'Materials', 3000000000, 'Vancouver, Canada', 2007, 150),
('Ioneer', 'IONR', 'https://www.ioneer.com', 'https://investors.ioneer.com', 'Lithium Mining', 'Materials', 500000000, 'Reno, NV', 2001, 30),

-- Energy
('Archaea Energy', 'LFG', 'https://www.archaeaenergy.com', 'https://ir.archaeaenergy.com', 'Renewable Energy', 'Energy', 2500000000, 'Houston, TX', 2018, 300),
('Montauk Renewables', 'MNTK', 'https://www.montaukrenewables.com', 'https://ir.montaukrenewables.com', 'Renewable Energy', 'Energy', 1500000000, 'Pittsburgh, PA', 1980, 200),
('Clean Energy Fuels', 'CLNE', 'https://www.cleanenergyfuels.com', 'https://investors.cleanenergyfuels.com', 'Alternative Fuels', 'Energy', 1000000000, 'Newport Beach, CA', 1997, 500),
('Renewable Energy Group', 'REGI', 'https://www.regi.com', 'https://investor.regi.com', 'Renewable Energy', 'Energy', 3000000000, 'Ames, IA', 2006, 1000),
('FuelCell Energy', 'FCEL', 'https://www.fuelcellenergy.com', 'https://investor.fce.com', 'Fuel Cells', 'Energy', 800000000, 'Danbury, CT', 1969, 400);