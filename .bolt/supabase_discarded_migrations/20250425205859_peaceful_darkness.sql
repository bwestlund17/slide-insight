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
('Appfolio', 'APPF', 'https://www.appfolio.com', 'https://ir.appfolio.com', 'Software', 'Technology', 6000000000, 'Santa Barbara, CA', 2006, 1500),
('Paylocity', 'PCTY', 'https://www.paylocity.com', 'https://investors.paylocity.com', 'Software', 'Technology', 12000000000, 'Schaumburg, IL', 1997, 4000),
('RingCentral', 'RNG', 'https://www.ringcentral.com', 'https://ir.ringcentral.com', 'Software', 'Technology', 4000000000, 'Belmont, CA', 1999, 3500),
('Smartsheet', 'SMAR', 'https://www.smartsheet.com', 'https://investors.smartsheet.com', 'Software', 'Technology', 7000000000, 'Bellevue, WA', 2005, 2500),
('Varonis Systems', 'VRNS', 'https://www.varonis.com', 'https://ir.varonis.com', 'Software', 'Technology', 3000000000, 'New York, NY', 2005, 2000),

-- Healthcare
('Amedisys', 'AMED2', 'https://www.amedisys.com', 'https://investors.amedisys.com', 'Healthcare Services', 'Healthcare', 3000000000, 'Baton Rouge, LA', 1982, 21000),
('Encompass Health', 'EHC', 'https://www.encompasshealth.com', 'https://investors.encompasshealth.com', 'Healthcare Services', 'Healthcare', 8000000000, 'Birmingham, AL', 1984, 30000),
('LHC Group', 'LHCG', 'https://www.lhcgroup.com', 'https://investor.lhcgroup.com', 'Healthcare Services', 'Healthcare', 6000000000, 'Lafayette, LA', 1994, 30000),
('Option Care Health', 'OPCH', 'https://www.optioncarehealth.com', 'https://investors.optioncarehealth.com', 'Healthcare Services', 'Healthcare', 5000000000, 'Bannockburn, IL', 1979, 6000),
('Select Medical', 'SEM', 'https://www.selectmedical.com', 'https://ir.selectmedical.com', 'Healthcare Services', 'Healthcare', 4000000000, 'Mechanicsburg, PA', 1996, 50000),

-- Consumer Discretionary
('Chewy', 'CHWY', 'https://www.chewy.com', 'https://investor.chewy.com', 'E-Commerce', 'Consumer Discretionary', 8000000000, 'Dania Beach, FL', 2011, 21000),
('Revolve Group', 'RVLV', 'https://www.revolve.com', 'https://investors.revolve.com', 'E-Commerce', 'Consumer Discretionary', 1500000000, 'Cerritos, CA', 2003, 1400),
('Warby Parker', 'WRBY', 'https://www.warbyparker.com', 'https://investors.warbyparker.com', 'Specialty Retail', 'Consumer Discretionary', 1500000000, 'New York, NY', 2010, 3000),
('Xponential Fitness', 'XPOF', 'https://www.xponential.com', 'https://investors.xponential.com', 'Leisure', 'Consumer Discretionary', 1000000000, 'Irvine, CA', 2017, 1000),
('1stDibs', 'DIBS', 'https://www.1stdibs.com', 'https://investors.1stdibs.com', 'E-Commerce', 'Consumer Discretionary', 300000000, 'New York, NY', 2001, 500),

-- Industrials
('Bloom Energy', 'BE', 'https://www.bloomenergy.com', 'https://investor.bloomenergy.com', 'Electrical Equipment', 'Industrials', 3000000000, 'San Jose, CA', 2001, 2000),
('Fluence Energy', 'FLNC', 'https://www.fluenceenergy.com', 'https://ir.fluenceenergy.com', 'Electrical Equipment', 'Industrials', 2500000000, 'Arlington, VA', 2018, 1000),
('Stem Inc', 'STEM', 'https://www.stem.com', 'https://investors.stem.com', 'Software', 'Industrials', 1500000000, 'San Francisco, CA', 2009, 500),
('Sunrun', 'RUN', 'https://www.sunrun.com', 'https://investors.sunrun.com', 'Solar', 'Industrials', 3500000000, 'San Francisco, CA', 2007, 12000),
('Sunnova', 'NOVA', 'https://www.sunnova.com', 'https://investors.sunnova.com', 'Solar', 'Industrials', 2000000000, 'Houston, TX', 2012, 1000),

-- Materials
('American Vanguard', 'AVD', 'https://www.american-vanguard.com', 'https://ir.american-vanguard.com', 'Agricultural Chemicals', 'Materials', 500000000, 'Newport Beach, CA', 1969, 800),
('LSB Industries', 'LXU', 'https://www.lsbindustries.com', 'https://investors.lsbindustries.com', 'Chemicals', 'Materials', 800000000, 'Oklahoma City, OK', 1968, 600),
('Koppers Holdings', 'KOP', 'https://www.koppers.com', 'https://investors.koppers.com', 'Chemicals', 'Materials', 1000000000, 'Pittsburgh, PA', 1988, 2100),
('Hawkins', 'HWKN', 'https://www.hawkinsinc.com', 'https://ir.hawkinsinc.com', 'Chemicals', 'Materials', 1200000000, 'Roseville, MN', 1938, 750),
('AdvanSix', 'ASIX', 'https://www.advansix.com', 'https://investors.advansix.com', 'Chemicals', 'Materials', 800000000, 'Parsippany, NJ', 2016, 1500),

-- Energy
('Chord Energy', 'CHRD', 'https://www.chordenergy.com', 'https://ir.chordenergy.com', 'Oil & Gas E&P', 'Energy', 7000000000, 'Houston, TX', 2022, 500),
('Civitas Resources', 'CIVI', 'https://www.civitasresources.com', 'https://ir.civitasresources.com', 'Oil & Gas E&P', 'Energy', 6000000000, 'Denver, CO', 2021, 400),
('Northern Oil & Gas', 'NOG', 'https://www.northernoil.com', 'https://ir.northernoil.com', 'Oil & Gas E&P', 'Energy', 3000000000, 'Minnetonka, MN', 2007, 100),
('Vital Energy', 'VTLE', 'https://www.vitalenergy.com', 'https://ir.vitalenergy.com', 'Oil & Gas E&P', 'Energy', 1000000000, 'Tulsa, OK', 2020, 300),
('W&T Offshore', 'WTI', 'https://www.wtoffshore.com', 'https://ir.wtoffshore.com', 'Oil & Gas E&P', 'Energy', 500000000, 'Houston, TX', 1983, 350);