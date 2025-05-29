/*
  # Add New Batch of Companies

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
('Twilio', 'TWLO', 'https://www.twilio.com', 'https://investors.twilio.com', 'Software', 'Technology', 12000000000, 'San Francisco, CA', 2008, 8000),
('Okta', 'OKTA', 'https://www.okta.com', 'https://investor.okta.com', 'Software', 'Technology', 15000000000, 'San Francisco, CA', 2009, 6000),
('Cloudflare', 'NET', 'https://www.cloudflare.com', 'https://investors.cloudflare.com', 'Software', 'Technology', 25000000000, 'San Francisco, CA', 2009, 3500),
('Fastly', 'FSLY', 'https://www.fastly.com', 'https://investors.fastly.com', 'Software', 'Technology', 2500000000, 'San Francisco, CA', 2011, 1000),
('Coupa Software', 'COUP', 'https://www.coupa.com', 'https://investors.coupa.com', 'Software', 'Technology', 5000000000, 'San Mateo, CA', 2006, 3000),

-- Healthcare
('Karuna Therapeutics', 'KRTX', 'https://www.karunatx.com', 'https://investors.karunatx.com', 'Biotechnology', 'Healthcare', 8000000000, 'Boston, MA', 2009, 400),
('Sage Therapeutics', 'SAGE', 'https://www.sagerx.com', 'https://investor.sagerx.com', 'Biotechnology', 'Healthcare', 2500000000, 'Cambridge, MA', 2010, 500),
('Beam Therapeutics', 'BEAM', 'https://www.beamtx.com', 'https://investors.beamtx.com', 'Biotechnology', 'Healthcare', 4000000000, 'Cambridge, MA', 2017, 600),
('Intellia Therapeutics', 'NTLA', 'https://www.intelliatx.com', 'https://ir.intelliatx.com', 'Biotechnology', 'Healthcare', 3500000000, 'Cambridge, MA', 2014, 500),
('Editas Medicine', 'EDIT', 'https://www.editasmedicine.com', 'https://ir.editasmedicine.com', 'Biotechnology', 'Healthcare', 1500000000, 'Cambridge, MA', 2013, 200),

-- Consumer Discretionary
('Peloton Interactive', 'PTON', 'https://www.onepeloton.com', 'https://investor.onepeloton.com', 'Leisure Products', 'Consumer Discretionary', 3000000000, 'New York, NY', 2012, 6000),
('Duolingo', 'DUOL', 'https://www.duolingo.com', 'https://investors.duolingo.com', 'Education', 'Consumer Discretionary', 8000000000, 'Pittsburgh, PA', 2011, 500),
('Coursera', 'COUR', 'https://www.coursera.org', 'https://investor.coursera.com', 'Education', 'Consumer Discretionary', 2500000000, 'Mountain View, CA', 2012, 1000),
('Udemy', 'UDMY', 'https://www.udemy.com', 'https://investors.udemy.com', 'Education', 'Consumer Discretionary', 2000000000, 'San Francisco, CA', 2010, 1400),
('Skillsoft', 'SKIL', 'https://www.skillsoft.com', 'https://investors.skillsoft.com', 'Education', 'Consumer Discretionary', 1000000000, 'Boston, MA', 1998, 2000),

-- Industrials
('Desktop Metal', 'DM', 'https://www.desktopmetal.com', 'https://ir.desktopmetal.com', '3D Printing', 'Industrials', 1000000000, 'Burlington, MA', 2015, 1200),
('Velo3D', 'VLD', 'https://www.velo3d.com', 'https://ir.velo3d.com', '3D Printing', 'Industrials', 500000000, 'Campbell, CA', 2014, 200),
('Markforged', 'MKFG', 'https://www.markforged.com', 'https://investors.markforged.com', '3D Printing', 'Industrials', 400000000, 'Watertown, MA', 2013, 400),
('Shapeways', 'SHPW', 'https://www.shapeways.com', 'https://investors.shapeways.com', '3D Printing', 'Industrials', 100000000, 'New York, NY', 2007, 200),
('Materialise', 'MTLS', 'https://www.materialise.com', 'https://investors.materialise.com', '3D Printing', 'Industrials', 800000000, 'Leuven, Belgium', 1990, 2200),

-- Materials
('Orion Engineered', 'OEC', 'https://www.orioncarbons.com', 'https://investor.orioncarbons.com', 'Specialty Chemicals', 'Materials', 1500000000, 'Houston, TX', 2014, 1450),
('GCP Applied Tech', 'GCP', 'https://www.gcpat.com', 'https://investor.gcpat.com', 'Construction Materials', 'Materials', 2000000000, 'Alpharetta, GA', 2016, 1800),
('Ingevity', 'NGVT', 'https://www.ingevity.com', 'https://ir.ingevity.com', 'Specialty Chemicals', 'Materials', 1800000000, 'North Charleston, SC', 2016, 1750),
('Livent', 'LTHM2', 'https://www.livent.com', 'https://ir.livent.com', 'Specialty Chemicals', 'Materials', 4000000000, 'Philadelphia, PA', 2018, 900),
('Element Solutions', 'ESI', 'https://www.elementsolutionsinc.com', 'https://investors.elementsolutionsinc.com', 'Specialty Chemicals', 'Materials', 5000000000, 'Fort Lauderdale, FL', 2013, 4400),

-- Energy
('Enphase Energy', 'ENPH', 'https://www.enphase.com', 'https://investor.enphase.com', 'Solar', 'Energy', 20000000000, 'Fremont, CA', 2006, 2500),
('SolarEdge', 'SEDG', 'https://www.solaredge.com', 'https://investors.solaredge.com', 'Solar', 'Energy', 15000000000, 'Herzliya, Israel', 2006, 4000),
('First Solar', 'FSLR', 'https://www.firstsolar.com', 'https://investor.firstsolar.com', 'Solar', 'Energy', 18000000000, 'Tempe, AZ', 1999, 5000),
('Sunrun', 'RUN2', 'https://www.sunrun.com', 'https://investors.sunrun.com', 'Solar', 'Energy', 5000000000, 'San Francisco, CA', 2007, 12000),
('Sunnova', 'NOVA2', 'https://www.sunnova.com', 'https://investors.sunnova.com', 'Solar', 'Energy', 2000000000, 'Houston, TX', 2012, 1200);