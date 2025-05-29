/*
  # Add sixth batch of S&P 500 companies

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
('Workday', 'WDAY', 'https://www.workday.com', 'https://investor.workday.com', 'Software', 'Technology', 65000000000, 'Pleasanton, CA', 2005, 17500),
('Fortinet', 'FTNT', 'https://www.fortinet.com', 'https://investor.fortinet.com', 'Cybersecurity', 'Technology', 45000000000, 'Sunnyvale, CA', 2000, 12000),
('Palo Alto Networks', 'PANW', 'https://www.paloaltonetworks.com', 'https://investors.paloaltonetworks.com', 'Cybersecurity', 'Technology', 75000000000, 'Santa Clara, CA', 2005, 13000),
('Crowdstrike', 'CRWD', 'https://www.crowdstrike.com', 'https://ir.crowdstrike.com', 'Cybersecurity', 'Technology', 55000000000, 'Austin, TX', 2011, 7000),
('Datadog', 'DDOG', 'https://www.datadoghq.com', 'https://investors.datadoghq.com', 'Software', 'Technology', 35000000000, 'New York, NY', 2010, 4000),

-- Healthcare
('Edwards Lifesciences', 'EW', 'https://www.edwards.com', 'https://ir.edwards.com', 'Medical Devices', 'Healthcare', 45000000000, 'Irvine, CA', 1958, 15000),
('IDEXX Laboratories', 'IDXX', 'https://www.idexx.com', 'https://www.idexx.com/en/about-idexx/investors', 'Healthcare Equipment', 'Healthcare', 40000000000, 'Westbrook, ME', 1983, 10000),
('ResMed', 'RMD', 'https://www.resmed.com', 'https://investor.resmed.com', 'Medical Devices', 'Healthcare', 30000000000, 'San Diego, CA', 1989, 8000),
('DexCom', 'DXCM', 'https://www.dexcom.com', 'https://investors.dexcom.com', 'Medical Devices', 'Healthcare', 45000000000, 'San Diego, CA', 1999, 7000),
('Align Technology', 'ALGN', 'https://www.aligntech.com', 'https://investor.aligntech.com', 'Medical Devices', 'Healthcare', 25000000000, 'Tempe, AZ', 1997, 22000),

-- Financial Services
('Aon', 'AON', 'https://www.aon.com', 'https://ir.aon.com', 'Insurance Brokers', 'Financial Services', 70000000000, 'London, UK', 1919, 50000),
('Arthur J. Gallagher', 'AJG', 'https://www.ajg.com', 'https://investor.ajg.com', 'Insurance Brokers', 'Financial Services', 45000000000, 'Rolling Meadows, IL', 1927, 39000),
('Willis Towers Watson', 'WTW', 'https://www.wtwco.com', 'https://investors.wtwco.com', 'Insurance Brokers', 'Financial Services', 25000000000, 'London, UK', 1828, 46000),
('Cboe Global Markets', 'CBOE', 'https://www.cboe.com', 'https://ir.cboe.com', 'Financial Exchanges', 'Financial Services', 15000000000, 'Chicago, IL', 1973, 1400),
('MSCI', 'MSCI', 'https://www.msci.com', 'https://ir.msci.com', 'Financial Data', 'Financial Services', 45000000000, 'New York, NY', 1969, 4700),

-- Consumer Staples
('Constellation Brands', 'STZ', 'https://www.cbrands.com', 'https://ir.cbrands.com', 'Beverages', 'Consumer Staples', 45000000000, 'Victor, NY', 1945, 10000),
('Brown-Forman', 'BF.B', 'https://www.brown-forman.com', 'https://investors.brown-forman.com', 'Beverages', 'Consumer Staples', 30000000000, 'Louisville, KY', 1870, 5200),
('Monster Beverage', 'MNST', 'https://www.monsterbevcorp.com', 'https://investors.monsterbevcorp.com', 'Beverages', 'Consumer Staples', 55000000000, 'Corona, CA', 1935, 4000),
('McCormick & Company', 'MKC', 'https://www.mccormickcorporation.com', 'https://ir.mccormick.com', 'Food Products', 'Consumer Staples', 20000000000, 'Hunt Valley, MD', 1889, 14000),
('Campbell Soup', 'CPB', 'https://www.campbellsoupcompany.com', 'https://investor.campbellsoupcompany.com', 'Food Products', 'Consumer Staples', 15000000000, 'Camden, NJ', 1869, 14500),

-- Industrials
('Carrier Global', 'CARR', 'https://www.carrier.com', 'https://ir.carrier.com', 'Building Products', 'Industrials', 40000000000, 'Palm Beach Gardens, FL', 1915, 52000),
('Otis Worldwide', 'OTIS', 'https://www.otis.com', 'https://investors.otis.com', 'Industrial Machinery', 'Industrials', 35000000000, 'Farmington, CT', 1853, 69000),
('Dover Corporation', 'DOV', 'https://www.dovercorporation.com', 'https://investors.dovercorporation.com', 'Industrial Machinery', 'Industrials', 20000000000, 'Downers Grove, IL', 1955, 25000),
('Ingersoll Rand', 'IR', 'https://www.ingersollrand.com', 'https://investors.ingersollrand.com', 'Industrial Machinery', 'Industrials', 25000000000, 'Davidson, NC', 1859, 16000),
('Trane Technologies', 'TT', 'https://www.tranetechnologies.com', 'https://investors.tranetechnologies.com', 'Building Products', 'Industrials', 45000000000, 'Swords, Ireland', 1885, 37000),

-- Real Estate
('Digital Realty', 'DLR', 'https://www.digitalrealty.com', 'https://investor.digitalrealty.com', 'REITs', 'Real Estate', 35000000000, 'Austin, TX', 2004, 3000),
('Equinix', 'EQIX', 'https://www.equinix.com', 'https://investor.equinix.com', 'REITs', 'Real Estate', 70000000000, 'Redwood City, CA', 1998, 10000),
('Public Storage', 'PSA', 'https://www.publicstorage.com', 'https://investors.publicstorage.com', 'REITs', 'Real Estate', 50000000000, 'Glendale, CA', 1972, 5000),
('Welltower', 'WELL', 'https://www.welltower.com', 'https://ir.welltower.com', 'REITs', 'Real Estate', 40000000000, 'Toledo, OH', 1970, 500),
('AvalonBay Communities', 'AVB', 'https://www.avalonbay.com', 'https://investors.avalonbay.com', 'REITs', 'Real Estate', 25000000000, 'Arlington, VA', 1978, 3000);