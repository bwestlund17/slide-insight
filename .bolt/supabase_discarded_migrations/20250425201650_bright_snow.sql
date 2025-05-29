/*
  # Add ninth batch of S&P 500 companies

  1. Changes
    - Add another batch of unique S&P 500 companies
    - Include complete company information
    - Maintain data validation constraints

  2. Notes
    - Market cap values are in USD
    - All companies are part of the S&P 500 index
    - Data includes sector, industry, and other key metrics
    - Removed duplicate companies and replaced with new unique entries
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Technology
('Akamai Technologies', 'AKAM', 'https://www.akamai.com', 'https://investors.akamai.com', 'Cloud Computing', 'Technology', 15000000000, 'Cambridge, MA', 1998, 8700),
('NetApp', 'NTAP', 'https://www.netapp.com', 'https://investors.netapp.com', 'Computer Storage', 'Technology', 12000000000, 'San Jose, CA', 1992, 12000),
('Teradyne', 'TER', 'https://www.teradyne.com', 'https://investors.teradyne.com', 'Semiconductor Equipment', 'Technology', 15000000000, 'North Reading, MA', 1960, 5900),
('Tyler Technologies', 'TYL', 'https://www.tylertech.com', 'https://investors.tylertech.com', 'Software', 'Technology', 18000000000, 'Plano, TX', 1966, 7500),
('PTC Inc.', 'PTC', 'https://www.ptc.com', 'https://investor.ptc.com', 'Software', 'Technology', 20000000000, 'Boston, MA', 1985, 6500),

-- Healthcare
('Waters Corporation', 'WAT', 'https://www.waters.com', 'https://ir.waters.com', 'Medical Devices', 'Healthcare', 18000000000, 'Milford, MA', 1958, 7800),
('Mettler-Toledo', 'MTD', 'https://www.mt.com', 'https://investor.mt.com', 'Medical Devices', 'Healthcare', 30000000000, 'Columbus, OH', 1945, 16000),
('Steris', 'STE', 'https://www.steris.com', 'https://ir.steris.com', 'Medical Equipment', 'Healthcare', 20000000000, 'Dublin, Ireland', 1985, 16000),
('Universal Health Services', 'UHS', 'https://www.uhsinc.com', 'https://ir.uhsinc.com', 'Healthcare Facilities', 'Healthcare', 10000000000, 'King of Prussia, PA', 1979, 89000),
('DaVita', 'DVA', 'https://www.davita.com', 'https://investors.davita.com', 'Healthcare Services', 'Healthcare', 8000000000, 'Denver, CO', 1994, 69000),

-- Industrials
('Rockwell Automation', 'ROK', 'https://www.rockwellautomation.com', 'https://ir.rockwellautomation.com', 'Industrial Automation', 'Industrials', 35000000000, 'Milwaukee, WI', 1903, 26000),
('Xylem', 'XYL', 'https://www.xylem.com', 'https://investors.xylem.com', 'Industrial Machinery', 'Industrials', 20000000000, 'Washington, DC', 2011, 17000),
('AMETEK', 'AME', 'https://www.ametek.com', 'https://investors.ametek.com', 'Electrical Equipment', 'Industrials', 30000000000, 'Berwyn, PA', 1930, 19000),
('Fortive', 'FTV', 'https://www.fortive.com', 'https://investors.fortive.com', 'Industrial Conglomerates', 'Industrials', 25000000000, 'Everett, WA', 2016, 17000),
('Roper Technologies', 'ROP', 'https://www.ropertech.com', 'https://investors.ropertech.com', 'Industrial Conglomerates', 'Industrials', 45000000000, 'Sarasota, FL', 1981, 16000),

-- Materials
('International Flavors', 'IFF', 'https://www.iff.com', 'https://ir.iff.com', 'Specialty Chemicals', 'Materials', 20000000000, 'New York, NY', 1889, 24000),
('Eastman Chemical', 'EMN', 'https://www.eastman.com', 'https://investors.eastman.com', 'Chemicals', 'Materials', 10000000000, 'Kingsport, TN', 1920, 14000),
('Avery Dennison', 'AVY', 'https://www.averydennison.com', 'https://ir.averydennison.com', 'Packaging Products', 'Materials', 15000000000, 'Mentor, OH', 1935, 36000),
('Packaging Corp', 'PKG', 'https://www.packagingcorp.com', 'https://ir.packagingcorp.com', 'Containers & Packaging', 'Materials', 12000000000, 'Lake Forest, IL', 1959, 15500),
('Crown Holdings', 'CCK', 'https://www.crowncork.com', 'https://ir.crowncork.com', 'Containers & Packaging', 'Materials', 10000000000, 'Yardley, PA', 1892, 33000),

-- Consumer Discretionary
('Advance Auto Parts', 'AAP', 'https://www.advanceautoparts.com', 'https://ir.advanceautoparts.com', 'Specialty Retail', 'Consumer Discretionary', 8000000000, 'Raleigh, NC', 1932, 71000),
('CarMax', 'KMX', 'https://www.carmax.com', 'https://investors.carmax.com', 'Specialty Retail', 'Consumer Discretionary', 12000000000, 'Richmond, VA', 1993, 30000),
('Genuine Parts', 'GPC', 'https://www.genpt.com', 'https://investors.genpt.com', 'Auto Parts', 'Consumer Discretionary', 25000000000, 'Atlanta, GA', 1928, 55000),
('Tractor Supply', 'TSCO', 'https://www.tractorsupply.com', 'https://ir.tractorsupply.com', 'Specialty Retail', 'Consumer Discretionary', 30000000000, 'Brentwood, TN', 1938, 45000),
('Ulta Beauty', 'ULTA', 'https://www.ulta.com', 'https://ir.ulta.com', 'Specialty Retail', 'Consumer Discretionary', 28000000000, 'Bolingbrook, IL', 1990, 44000),

-- Real Estate
('Extra Space Storage', 'EXR', 'https://www.extraspace.com', 'https://ir.extraspace.com', 'REITs', 'Real Estate', 20000000000, 'Salt Lake City, UT', 1977, 4500),
('Life Storage', 'LSI', 'https://www.lifestorage.com', 'https://investors.lifestorage.com', 'REITs', 'Real Estate', 12000000000, 'Buffalo, NY', 1982, 2000),
('Mid-America Apartment', 'MAA', 'https://www.maac.com', 'https://ir.maac.com', 'REITs', 'Real Estate', 18000000000, 'Memphis, TN', 1977, 2400),
('Essex Property Trust', 'ESS', 'https://www.essex.com', 'https://investors.essex.com', 'REITs', 'Real Estate', 15000000000, 'San Mateo, CA', 1971, 1800),
('UDR Inc.', 'UDR', 'https://www.udr.com', 'https://ir.udr.com', 'REITs', 'Real Estate', 12000000000, 'Highlands Ranch, CO', 1972, 1400);