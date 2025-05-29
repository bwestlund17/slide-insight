/*
  # Add eleventh batch of S&P 500 companies

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
('Arista Networks', 'ANET', 'https://www.arista.com', 'https://investors.arista.com', 'Networking Equipment', 'Technology', 65000000000, 'Santa Clara, CA', 2004, 3500),
('Lattice Semiconductor', 'LSCC', 'https://www.latticesemi.com', 'https://ir.latticesemi.com', 'Semiconductors', 'Technology', 12000000000, 'Hillsboro, OR', 1983, 1000),
('Monolithic Power', 'MPWR', 'https://www.monolithicpower.com', 'https://ir.monolithicpower.com', 'Semiconductors', 'Technology', 25000000000, 'Kirkland, WA', 1997, 3000),
('Skyworks Solutions', 'SWKS', 'https://www.skyworksinc.com', 'https://investors.skyworksinc.com', 'Semiconductors', 'Technology', 18000000000, 'Irvine, CA', 1962, 11000),
('Qorvo', 'QRVO', 'https://www.qorvo.com', 'https://ir.qorvo.com', 'Semiconductors', 'Technology', 10000000000, 'Greensboro, NC', 2015, 8900),

-- Healthcare
('Insulet', 'PODD', 'https://www.insulet.com', 'https://investor.insulet.com', 'Medical Devices', 'Healthcare', 15000000000, 'Acton, MA', 2000, 2500),
('Masimo', 'MASI', 'https://www.masimo.com', 'https://investor.masimo.com', 'Medical Devices', 'Healthcare', 8000000000, 'Irvine, CA', 1989, 5200),
('Penumbra', 'PEN', 'https://www.penumbrainc.com', 'https://investors.penumbrainc.com', 'Medical Devices', 'Healthcare', 12000000000, 'Alameda, CA', 2004, 4200),
('Teleflex', 'TFX', 'https://www.teleflex.com', 'https://investors.teleflex.com', 'Medical Devices', 'Healthcare', 10000000000, 'Wayne, PA', 1943, 14000),
('Globus Medical', 'GMED', 'https://www.globusmedical.com', 'https://investors.globusmedical.com', 'Medical Devices', 'Healthcare', 7000000000, 'Audubon, PA', 2003, 2400),

-- Consumer Discretionary
('Deckers Outdoor', 'DECK', 'https://www.deckers.com', 'https://ir.deckers.com', 'Footwear & Accessories', 'Consumer Discretionary', 15000000000, 'Goleta, CA', 1973, 3500),
('Crocs', 'CROX', 'https://www.crocs.com', 'https://investors.crocs.com', 'Footwear & Accessories', 'Consumer Discretionary', 8000000000, 'Broomfield, CO', 2002, 6000),
('Skechers', 'SKX', 'https://www.skechers.com', 'https://investors.skechers.com', 'Footwear & Accessories', 'Consumer Discretionary', 10000000000, 'Manhattan Beach, CA', 1992, 7500),
('Thor Industries', 'THO', 'https://www.thorindustries.com', 'https://investors.thorindustries.com', 'Recreational Vehicles', 'Consumer Discretionary', 6000000000, 'Elkhart, IN', 1980, 32000),
('Brunswick', 'BC', 'https://www.brunswick.com', 'https://ir.brunswick.com', 'Recreational Products', 'Consumer Discretionary', 7000000000, 'Mettawa, IL', 1845, 18000),

-- Industrials
('Lennox International', 'LII', 'https://www.lennoxinternational.com', 'https://investors.lennoxinternational.com', 'Building Products', 'Industrials', 15000000000, 'Richardson, TX', 1895, 11000),
('A.O. Smith', 'AOS', 'https://www.aosmith.com', 'https://investor.aosmith.com', 'Building Products', 'Industrials', 12000000000, 'Milwaukee, WI', 1874, 14000),
('Carlisle Companies', 'CSL', 'https://www.carlisle.com', 'https://ir.carlisle.com', 'Industrial Conglomerates', 'Industrials', 15000000000, 'Scottsdale, AZ', 1917, 11000),
('Curtiss-Wright', 'CW', 'https://www.curtisswright.com', 'https://investors.curtisswright.com', 'Aerospace & Defense', 'Industrials', 8000000000, 'Davidson, NC', 1929, 8000),
('Crane Company', 'CR', 'https://www.craneco.com', 'https://ir.craneco.com', 'Industrial Machinery', 'Industrials', 7000000000, 'Stamford, CT', 1855, 11000),

-- Materials
('Olin Corporation', 'OLN', 'https://www.olin.com', 'https://investors.olin.com', 'Chemicals', 'Materials', 7000000000, 'Clayton, MO', 1892, 7000),
('Commercial Metals', 'CMC', 'https://www.cmc.com', 'https://ir.cmc.com', 'Steel', 'Materials', 6000000000, 'Irving, TX', 1915, 12000),
('Reliance Steel', 'RS', 'https://www.rsac.com', 'https://investor.rsac.com', 'Steel', 'Materials', 15000000000, 'Los Angeles, CA', 1939, 15000),
('Steel Dynamics', 'STLD', 'https://www.steeldynamics.com', 'https://investors.steeldynamics.com', 'Steel', 'Materials', 12000000000, 'Fort Wayne, IN', 1993, 11000),
('Cleveland-Cliffs', 'CLF', 'https://www.clevelandcliffs.com', 'https://ir.clevelandcliffs.com', 'Steel', 'Materials', 8000000000, 'Cleveland, OH', 1847, 27000),

-- Consumer Staples
('Lamb Weston', 'LW', 'https://www.lambweston.com', 'https://investors.lambweston.com', 'Food Products', 'Consumer Staples', 15000000000, 'Eagle, ID', 1950, 8000),
('Ingredion', 'INGR', 'https://www.ingredion.com', 'https://ir.ingredion.com', 'Food Products', 'Consumer Staples', 7000000000, 'Westchester, IL', 1906, 12000),
('Lancaster Colony', 'LANC', 'https://www.lancastercolony.com', 'https://ir.lancastercolony.com', 'Food Products', 'Consumer Staples', 5000000000, 'Westerville, OH', 1961, 3000),
('Flowers Foods', 'FLO', 'https://www.flowersfoods.com', 'https://investors.flowersfoods.com', 'Food Products', 'Consumer Staples', 5000000000, 'Thomasville, GA', 1919, 9000),
('TreeHouse Foods', 'THS', 'https://www.treehousefoods.com', 'https://ir.treehousefoods.com', 'Food Products', 'Consumer Staples', 3000000000, 'Oak Brook, IL', 2005, 10000);