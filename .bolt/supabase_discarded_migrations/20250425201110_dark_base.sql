/*
  # Add seventh batch of S&P 500 companies

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
('Micron Technology', 'MU', 'https://www.micron.com', 'https://investors.micron.com', 'Semiconductors', 'Technology', 80000000000, 'Boise, ID', 1978, 48000),
('Western Digital', 'WDC', 'https://www.westerndigital.com', 'https://investor.wdc.com', 'Computer Hardware', 'Technology', 15000000000, 'San Jose, CA', 1970, 65000),
('Seagate Technology', 'STX', 'https://www.seagate.com', 'https://investors.seagate.com', 'Computer Hardware', 'Technology', 12000000000, 'Fremont, CA', 1978, 40000),
('Juniper Networks', 'JNPR', 'https://www.juniper.net', 'https://investor.juniper.net', 'Networking Equipment', 'Technology', 10000000000, 'Sunnyvale, CA', 1996, 10000),
('F5 Networks', 'FFIV', 'https://www.f5.com', 'https://investors.f5.com', 'Networking Equipment', 'Technology', 8000000000, 'Seattle, WA', 1996, 6500),

-- Healthcare
('Moderna', 'MRNA', 'https://www.modernatx.com', 'https://investors.modernatx.com', 'Biotechnology', 'Healthcare', 45000000000, 'Cambridge, MA', 2010, 3900),
('Illumina', 'ILMN', 'https://www.illumina.com', 'https://investor.illumina.com', 'Biotechnology', 'Healthcare', 30000000000, 'San Diego, CA', 1998, 9800),
('IQVIA Holdings', 'IQV', 'https://www.iqvia.com', 'https://ir.iqvia.com', 'Healthcare Services', 'Healthcare', 40000000000, 'Durham, NC', 2016, 85000),
('Laboratory Corp', 'LH', 'https://www.labcorp.com', 'https://ir.labcorp.com', 'Healthcare Services', 'Healthcare', 20000000000, 'Burlington, NC', 1978, 75000),
('Quest Diagnostics', 'DGX', 'https://www.questdiagnostics.com', 'https://investor.questdiagnostics.com', 'Healthcare Services', 'Healthcare', 15000000000, 'Secaucus, NJ', 1967, 40000),

-- Financial Services
('Northern Trust', 'NTRS', 'https://www.northerntrust.com', 'https://investor.northerntrust.com', 'Asset Management', 'Financial Services', 15000000000, 'Chicago, IL', 1889, 23000),
('State Street', 'STT', 'https://www.statestreet.com', 'https://investors.statestreet.com', 'Asset Management', 'Financial Services', 25000000000, 'Boston, MA', 1792, 42000),
('T. Rowe Price', 'TROW', 'https://www.troweprice.com', 'https://troweprice.gcs-web.com', 'Asset Management', 'Financial Services', 25000000000, 'Baltimore, MD', 1937, 7500),
('Invesco', 'IVZ', 'https://www.invesco.com', 'https://ir.invesco.com', 'Asset Management', 'Financial Services', 8000000000, 'Atlanta, GA', 1935, 8500),
('Franklin Resources', 'BEN', 'https://www.franklintempleton.com', 'https://investors.franklintempleton.com', 'Asset Management', 'Financial Services', 12000000000, 'San Mateo, CA', 1947, 9800),

-- Consumer Discretionary
('Ross Stores', 'ROST', 'https://www.rossstores.com', 'https://investors.rossstores.com', 'Retail', 'Consumer Discretionary', 40000000000, 'Dublin, CA', 1950, 100000),
('Dollar Tree', 'DLTR', 'https://www.dollartree.com', 'https://corporate.dollartree.com/investors', 'Retail', 'Consumer Discretionary', 35000000000, 'Chesapeake, VA', 1986, 200000),
('Dollar General', 'DG', 'https://www.dollargeneral.com', 'https://investor.dollargeneral.com', 'Retail', 'Consumer Discretionary', 45000000000, 'Goodlettsville, TN', 1939, 170000),
('AutoZone', 'AZO', 'https://www.autozone.com', 'https://investors.autozone.com', 'Specialty Retail', 'Consumer Discretionary', 55000000000, 'Memphis, TN', 1979, 110000),
('O''Reilly Automotive', 'ORLY', 'https://www.oreillyauto.com', 'https://corporate.oreillyauto.com/investor-relations', 'Specialty Retail', 'Consumer Discretionary', 65000000000, 'Springfield, MO', 1957, 85000),

-- Industrials
('Waste Management', 'WM', 'https://www.wm.com', 'https://investors.wm.com', 'Environmental Services', 'Industrials', 70000000000, 'Houston, TX', 1968, 50000),
('Republic Services', 'RSG', 'https://www.republicservices.com', 'https://investor.republicservices.com', 'Environmental Services', 'Industrials', 45000000000, 'Phoenix, AZ', 1996, 39000),
('Cintas', 'CTAS', 'https://www.cintas.com', 'https://investors.cintas.com', 'Business Services', 'Industrials', 55000000000, 'Cincinnati, OH', 1929, 45000),
('Fastenal', 'FAST', 'https://www.fastenal.com', 'https://investor.fastenal.com', 'Industrial Distribution', 'Industrials', 35000000000, 'Winona, MN', 1967, 22000),
('W.W. Grainger', 'GWW', 'https://www.grainger.com', 'https://invest.grainger.com', 'Industrial Distribution', 'Industrials', 40000000000, 'Lake Forest, IL', 1927, 25000),

-- Materials
('Vulcan Materials', 'VMC', 'https://www.vulcanmaterials.com', 'https://ir.vulcanmaterials.com', 'Construction Materials', 'Materials', 25000000000, 'Birmingham, AL', 1909, 11000),
('Martin Marietta', 'MLM', 'https://www.martinmarietta.com', 'https://ir.martinmarietta.com', 'Construction Materials', 'Materials', 30000000000, 'Raleigh, NC', 1939, 9000),
('Albemarle', 'ALB', 'https://www.albemarle.com', 'https://investors.albemarle.com', 'Specialty Chemicals', 'Materials', 20000000000, 'Charlotte, NC', 1887, 7000),
('FMC Corporation', 'FMC', 'https://www.fmc.com', 'https://investors.fmc.com', 'Agricultural Chemicals', 'Materials', 12000000000, 'Philadelphia, PA', 1883, 6500),
('CF Industries', 'CF', 'https://www.cfindustries.com', 'https://investors.cfindustries.com', 'Agricultural Chemicals', 'Materials', 15000000000, 'Deerfield, IL', 1946, 3000);