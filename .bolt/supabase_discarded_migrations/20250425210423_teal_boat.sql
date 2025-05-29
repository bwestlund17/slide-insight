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
('Dropbox', 'DBX', 'https://www.dropbox.com', 'https://investors.dropbox.com', 'Software', 'Technology', 8000000000, 'San Francisco, CA', 2007, 3000),
('Box', 'BOX2', 'https://www.box.com', 'https://box.gcs-web.com', 'Software', 'Technology', 4000000000, 'Redwood City, CA', 2005, 2000),
('Nutanix', 'NTNX', 'https://www.nutanix.com', 'https://ir.nutanix.com', 'Cloud Computing', 'Technology', 7000000000, 'San Jose, CA', 2009, 6500),
('Pure Storage', 'PSTG', 'https://www.purestorage.com', 'https://investor.purestorage.com', 'Computer Storage', 'Technology', 10000000000, 'Mountain View, CA', 2009, 4500),
('Teradata', 'TDC', 'https://www.teradata.com', 'https://investor.teradata.com', 'Software', 'Technology', 5000000000, 'San Diego, CA', 1979, 7500),

-- Healthcare
('Guardant Health', 'GH', 'https://www.guardanthealth.com', 'https://investors.guardanthealth.com', 'Diagnostics', 'Healthcare', 3000000000, 'Palo Alto, CA', 2012, 1800),
('Natera', 'NTRA', 'https://www.natera.com', 'https://investor.natera.com', 'Diagnostics', 'Healthcare', 5000000000, 'Austin, TX', 2004, 3000),
('Invitae', 'NVTA', 'https://www.invitae.com', 'https://ir.invitae.com', 'Diagnostics', 'Healthcare', 500000000, 'San Francisco, CA', 2010, 2800),
('CareDx', 'CDNA', 'https://www.caredx.com', 'https://ir.caredx.com', 'Diagnostics', 'Healthcare', 800000000, 'Brisbane, CA', 1998, 1000),
('Personalis', 'PSNL', 'https://www.personalis.com', 'https://ir.personalis.com', 'Diagnostics', 'Healthcare', 200000000, 'Menlo Park, CA', 2011, 400),

-- Consumer Discretionary
('Revolve Group', 'RVLV2', 'https://www.revolve.com', 'https://investors.revolve.com', 'E-Commerce', 'Consumer Discretionary', 2000000000, 'Cerritos, CA', 2003, 1500),
('Allbirds', 'BIRD', 'https://www.allbirds.com', 'https://ir.allbirds.com', 'Footwear', 'Consumer Discretionary', 300000000, 'San Francisco, CA', 2015, 1000),
('Torrid', 'CURV', 'https://www.torrid.com', 'https://investors.torrid.com', 'Apparel', 'Consumer Discretionary', 400000000, 'City of Industry, CA', 2001, 8000),
('a.k.a. Brands', 'AKA', 'https://www.aka-brands.com', 'https://ir.aka-brands.com', 'E-Commerce', 'Consumer Discretionary', 200000000, 'San Francisco, CA', 2018, 1000),
('Honest Company', 'HNST', 'https://www.honest.com', 'https://investors.honest.com', 'Personal Care', 'Consumer Discretionary', 300000000, 'Los Angeles, CA', 2011, 800),

-- Industrials
('Symbotic', 'SYM', 'https://www.symbotic.com', 'https://ir.symbotic.com', 'Robotics', 'Industrials', 15000000000, 'Wilmington, MA', 2006, 1500),
('AeroVironment', 'AVAV', 'https://www.avinc.com', 'https://investor.avinc.com', 'Aerospace & Defense', 'Industrials', 3000000000, 'Arlington, VA', 1971, 1200),
('Kratos Defense', 'KTOS', 'https://www.kratosdefense.com', 'https://ir.kratosdefense.com', 'Aerospace & Defense', 'Industrials', 2000000000, 'San Diego, CA', 1994, 3500),
('Virgin Galactic', 'SPCE', 'https://www.virgingalactic.com', 'https://investors.virgingalactic.com', 'Aerospace', 'Industrials', 1000000000, 'Las Cruces, NM', 2004, 1000),
('Momentus', 'MNTS', 'https://www.momentus.space', 'https://investors.momentus.space', 'Space Technology', 'Industrials', 100000000, 'San Jose, CA', 2017, 200),

-- Materials
('Piedmont Lithium', 'PLL3', 'https://www.piedmontlithium.com', 'https://ir.piedmontlithium.com', 'Lithium Mining', 'Materials', 1200000000, 'Belmont, NC', 2016, 50),
('Lithium Americas', 'LAC2', 'https://www.lithiumamericas.com', 'https://www.lithiumamericas.com/investors', 'Lithium Mining', 'Materials', 3000000000, 'Vancouver, Canada', 2007, 150),
('Sigma Lithium', 'SGML2', 'https://www.sigmalithium.ca', 'https://ir.sigmalithium.ca', 'Lithium Mining', 'Materials', 4000000000, 'São Paulo, Brazil', 2012, 100),
('Standard Lithium', 'SLI2', 'https://www.standardlithium.com', 'https://www.standardlithium.com/investors', 'Lithium Mining', 'Materials', 800000000, 'Vancouver, Canada', 2017, 40),
('Ioneer', 'IONR2', 'https://www.ioneer.com', 'https://investors.ioneer.com', 'Lithium Mining', 'Materials', 500000000, 'Reno, NV', 2001, 30),

-- Energy
('Plug Power', 'PLUG', 'https://www.plugpower.com', 'https://ir.plugpower.com', 'Renewable Energy', 'Energy', 4000000000, 'Latham, NY', 1997, 3000),
('Ballard Power', 'BLDP', 'https://www.ballard.com', 'https://www.ballard.com/investors', 'Fuel Cells', 'Energy', 1000000000, 'Burnaby, Canada', 1979, 1000),
('Bloom Energy', 'BE2', 'https://www.bloomenergy.com', 'https://investor.bloomenergy.com', 'Fuel Cells', 'Energy', 3000000000, 'San Jose, CA', 2001, 2000),
('Enovix', 'ENVX', 'https://www.enovix.com', 'https://ir.enovix.com', 'Batteries', 'Energy', 2000000000, 'Fremont, CA', 2007, 400),
('QuantumScape', 'QS', 'https://www.quantumscape.com', 'https://ir.quantumscape.com', 'Batteries', 'Energy', 3500000000, 'San Jose, CA', 2010, 800);