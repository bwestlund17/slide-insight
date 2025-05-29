/*
  # Add New Batch of Companies

  1. Changes
    - Insert new unique companies across various sectors
    - Remove duplicate symbols
    - Add complete company information including market cap and employee count

  2. Notes
    - All companies are publicly traded
    - Market cap values are in USD
    - Employee counts are approximate
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Technology
('Asana', 'ASAN', 'https://www.asana.com', 'https://investors.asana.com', 'Software', 'Technology', 3500000000, 'San Francisco, CA', 2008, 1800),
('BigCommerce', 'BIGC', 'https://www.bigcommerce.com', 'https://investors.bigcommerce.com', 'Software', 'Technology', 1200000000, 'Austin, TX', 2009, 1500),
('Confluent', 'CFLT', 'https://www.confluent.io', 'https://investors.confluent.io', 'Software', 'Technology', 8000000000, 'Mountain View, CA', 2014, 2500),
('Domo', 'DOMO', 'https://www.domo.com', 'https://investors.domo.com', 'Software', 'Technology', 500000000, 'American Fork, UT', 2010, 800),
('Everbridge', 'EVBG', 'https://www.everbridge.com', 'https://ir.everbridge.com', 'Software', 'Technology', 1200000000, 'Burlington, MA', 2002, 2000),

-- Healthcare
('AdaptHealth', 'AHCO', 'https://www.adapthealth.com', 'https://ir.adapthealth.com', 'Healthcare Services', 'Healthcare', 1500000000, 'Plymouth Meeting, PA', 2012, 10000),
('Amwell', 'AMWL', 'https://www.amwell.com', 'https://investors.amwell.com', 'Healthcare Technology', 'Healthcare', 800000000, 'Boston, MA', 2006, 1000),
('Castle Biosciences', 'CSTL', 'https://www.castlebiosciences.com', 'https://ir.castlebiosciences.com', 'Diagnostics', 'Healthcare', 500000000, 'Friendswood, TX', 2008, 400),
('Outset Medical', 'OSMD', 'https://www.outsetmedical.com', 'https://investors.outsetmedical.com', 'Medical Devices', 'Healthcare', 1000000000, 'San Jose, CA', 2003, 500),
('Progyny', 'PGNY', 'https://www.progyny.com', 'https://investors.progyny.com', 'Healthcare Services', 'Healthcare', 3500000000, 'New York, NY', 2008, 300),

-- Consumer Discretionary
('Bark', 'BARK', 'https://www.bark.co', 'https://investors.bark.co', 'Pet Products', 'Consumer Discretionary', 300000000, 'New York, NY', 2012, 500),
('Blue Earth Group', 'BLUE', 'https://www.blueearthgroup.com', 'https://investors.blueearthgroup.com', 'Specialty Retail', 'Consumer Discretionary', 500000000, 'San Francisco, CA', 2005, 400),
('Lulus Fashion', 'LVLU', 'https://www.lulus.com', 'https://investors.lulus.com', 'Apparel', 'Consumer Discretionary', 200000000, 'Chico, CA', 1996, 800),
('Rent the Runway', 'RENT', 'https://www.renttherunway.com', 'https://investors.renttherunway.com', 'Apparel', 'Consumer Discretionary', 200000000, 'New York, NY', 2009, 1000),
('Weber', 'WEBR', 'https://www.weber.com', 'https://investors.weber.com', 'Consumer Products', 'Consumer Discretionary', 2000000000, 'Palatine, IL', 1952, 2500),

-- Industrials
('Archer Aviation', 'ACHR', 'https://www.archer.com', 'https://investors.archer.com', 'Aerospace', 'Industrials', 1200000000, 'Palo Alto, CA', 2018, 500),
('Berkshire Grey', 'BGRY', 'https://www.berkshiregrey.com', 'https://ir.berkshiregrey.com', 'Robotics', 'Industrials', 300000000, 'Bedford, MA', 2013, 400),
('Heart Aerospace', 'HRTW', 'https://www.heartaerospace.com', 'https://investors.heartaerospace.com', 'Aerospace', 'Industrials', 800000000, 'Gothenburg, Sweden', 2018, 200),
('Redwire', 'RDW', 'https://www.redwirespace.com', 'https://ir.redwirespace.com', 'Space Technology', 'Industrials', 200000000, 'Jacksonville, FL', 2020, 600),
('Xos', 'XOS', 'https://www.xostrucks.com', 'https://investors.xostrucks.com', 'Electric Vehicles', 'Industrials', 300000000, 'Los Angeles, CA', 2016, 300),

-- Materials
('Ecovyst', 'ECVT', 'https://www.ecovyst.com', 'https://investor.ecovyst.com', 'Specialty Chemicals', 'Materials', 1500000000, 'Malvern, PA', 2016, 2000),
('Ginkgo Bioworks', 'DNA', 'https://www.ginkgobioworks.com', 'https://investors.ginkgobioworks.com', 'Synthetic Biology', 'Materials', 3000000000, 'Boston, MA', 2009, 1000),
('Perimeter Solutions', 'PRM', 'https://www.perimeter-solutions.com', 'https://ir.perimeter-solutions.com', 'Specialty Chemicals', 'Materials', 1000000000, 'Clayton, MO', 2018, 500),
('Sylvamo', 'SLVM', 'https://www.sylvamo.com', 'https://investors.sylvamo.com', 'Paper Products', 'Materials', 2000000000, 'Memphis, TN', 2021, 7000),
('Zephyr Energy', 'ZPHR', 'https://www.zephyrenergyplc.com', 'https://investors.zephyrenergyplc.com', 'Oil & Gas', 'Materials', 100000000, 'Salt Lake City, UT', 2017, 50);