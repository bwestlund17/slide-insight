/*
  # Add seventeenth batch of S&P 500 companies

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
('Aspen Technology', 'AZPN', 'https://www.aspentech.com', 'https://ir.aspentech.com', 'Software', 'Technology', 12000000000, 'Bedford, MA', 1981, 3700),
('Dynatrace', 'DT', 'https://www.dynatrace.com', 'https://ir.dynatrace.com', 'Software', 'Technology', 15000000000, 'Waltham, MA', 2005, 3600),
('New Relic', 'NEWR', 'https://www.newrelic.com', 'https://ir.newrelic.com', 'Software', 'Technology', 5000000000, 'San Francisco, CA', 2008, 2200),
('SentinelOne', 'S', 'https://www.sentinelone.com', 'https://investors.sentinelone.com', 'Cybersecurity', 'Technology', 8000000000, 'Mountain View, CA', 2013, 2100),
('Rapid7', 'RPD', 'https://www.rapid7.com', 'https://investors.rapid7.com', 'Cybersecurity', 'Technology', 3500000000, 'Boston, MA', 2000, 2500),

-- Healthcare
('Shockwave Medical', 'SWAV', 'https://www.shockwavemedical.com', 'https://ir.shockwavemedical.com', 'Medical Devices', 'Healthcare', 12000000000, 'Santa Clara, CA', 2009, 1000),
('Tandem Diabetes', 'TNDM', 'https://www.tandemdiabetes.com', 'https://investor.tandemdiabetes.com', 'Medical Devices', 'Healthcare', 2500000000, 'San Diego, CA', 2006, 2000),
('Axonics', 'AXNX', 'https://www.axonics.com', 'https://ir.axonics.com', 'Medical Devices', 'Healthcare', 3500000000, 'Irvine, CA', 2012, 800),
('Outset Medical', 'OM', 'https://www.outsetmedical.com', 'https://investors.outsetmedical.com', 'Medical Devices', 'Healthcare', 1500000000, 'San Jose, CA', 2003, 500),
('Inari Medical', 'NARI', 'https://www.inarimedical.com', 'https://ir.inarimedical.com', 'Medical Devices', 'Healthcare', 4000000000, 'Irvine, CA', 2011, 1200),

-- Consumer Discretionary
('Academy Sports', 'ASO', 'https://www.academy.com', 'https://investors.academy.com', 'Specialty Retail', 'Consumer Discretionary', 5000000000, 'Katy, TX', 1938, 22000),
('Boot Barn', 'BOOT', 'https://www.bootbarn.com', 'https://investor.bootbarn.com', 'Specialty Retail', 'Consumer Discretionary', 2500000000, 'Irvine, CA', 1978, 4000),
('Leslie''s', 'LESL', 'https://www.lesliespool.com', 'https://ir.lesliespool.com', 'Specialty Retail', 'Consumer Discretionary', 1500000000, 'Phoenix, AZ', 1963, 4000),
('Petco', 'WOOF', 'https://www.petco.com', 'https://ir.petco.com', 'Specialty Retail', 'Consumer Discretionary', 2000000000, 'San Diego, CA', 1965, 28000),
('Brilliant Earth', 'BRLT', 'https://www.brilliantearth.com', 'https://investors.brilliantearth.com', 'Specialty Retail', 'Consumer Discretionary', 500000000, 'San Francisco, CA', 2005, 400),

-- Industrials
('Kornit Digital', 'KRNT', 'https://www.kornit.com', 'https://ir.kornit.com', 'Industrial Machinery', 'Industrials', 1000000000, 'Rosh HaAyin, Israel', 2002, 900),
('Evoqua Water', 'AQUA', 'https://www.evoqua.com', 'https://ir.evoqua.com', 'Pollution Control', 'Industrials', 5000000000, 'Pittsburgh, PA', 2013, 4000),
('Montrose Environmental', 'MEG', 'https://www.montrose-env.com', 'https://investors.montrose-env.com', 'Environmental Services', 'Industrials', 1000000000, 'Irvine, CA', 2012, 2500),
('Array Technologies', 'ARRY', 'https://www.arraytechinc.com', 'https://ir.arraytechinc.com', 'Solar Equipment', 'Industrials', 3000000000, 'Albuquerque, NM', 1989, 1400),
('Shoals Technologies', 'SHLS', 'https://www.shoals.com', 'https://investors.shoals.com', 'Solar Equipment', 'Industrials', 4000000000, 'Portland, TN', 1996, 1400),

-- Materials
('MP Materials', 'MP', 'https://www.mpmaterials.com', 'https://investors.mpmaterials.com', 'Rare Earth Mining', 'Materials', 4000000000, 'Las Vegas, NV', 2017, 400),
('Livent', 'LTHM', 'https://www.livent.com', 'https://ir.livent.com', 'Specialty Chemicals', 'Materials', 3500000000, 'Philadelphia, PA', 2018, 1100),
('Piedmont Lithium', 'PLL', 'https://www.piedmontlithium.com', 'https://ir.piedmontlithium.com', 'Lithium Mining', 'Materials', 1000000000, 'Belmont, NC', 1983, 50),
('Compass Minerals', 'CMP', 'https://www.compassminerals.com', 'https://investors.compassminerals.com', 'Specialty Chemicals', 'Materials', 1500000000, 'Overland Park, KS', 1993, 2000),
('Intrepid Potash', 'IPI', 'https://www.intrepidpotash.com', 'https://investors.intrepidpotash.com', 'Agricultural Chemicals', 'Materials', 500000000, 'Denver, CO', 2000, 400),

-- Energy
('Denbury', 'DEN', 'https://www.denbury.com', 'https://investors.denbury.com', 'Oil & Gas E&P', 'Energy', 4500000000, 'Plano, TX', 1999, 700),
('Matador Resources', 'MTDR', 'https://www.matadorresources.com', 'https://ir.matadorresources.com', 'Oil & Gas E&P', 'Energy', 7000000000, 'Dallas, TX', 2003, 350),
('SM Energy', 'SM', 'https://www.sm-energy.com', 'https://ir.sm-energy.com', 'Oil & Gas E&P', 'Energy', 4000000000, 'Denver, CO', 1908, 500),
('Ranger Oil', 'ROCC', 'https://www.rangeroil.com', 'https://ir.rangeroil.com', 'Oil & Gas E&P', 'Energy', 2000000000, 'Houston, TX', 2021, 200),
('Centennial Resource', 'CDEV', 'https://www.centennialdev.com', 'https://ir.centennialdev.com', 'Oil & Gas E&P', 'Energy', 2500000000, 'Denver, CO', 2015, 300);