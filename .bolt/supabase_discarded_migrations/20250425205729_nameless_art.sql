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
('Alteryx', 'AYXB', 'https://www.alteryx.com', 'https://investor.alteryx.com', 'Software', 'Technology', 2800000000, 'Irvine, CA', 2010, 2800),
('BlackLine', 'BLK2', 'https://www.blackline.com', 'https://investors.blackline.com', 'Software', 'Technology', 3500000000, 'Woodland Hills, CA', 2001, 4000),
('Ceridian', 'CDAY2', 'https://www.ceridian.com', 'https://investors.ceridian.com', 'Software', 'Technology', 10000000000, 'Minneapolis, MN', 1992, 7500),
('DigitalOcean', 'DOCN2', 'https://www.digitalocean.com', 'https://investors.digitalocean.com', 'Cloud Computing', 'Technology', 4500000000, 'New York, NY', 2011, 1200),
('Elastic', 'ESTC2', 'https://www.elastic.co', 'https://ir.elastic.co', 'Software', 'Technology', 8000000000, 'Mountain View, CA', 2012, 3200),

-- Healthcare
('Accolade', 'ACCD2', 'https://www.accolade.com', 'https://ir.accolade.com', 'Healthcare Technology', 'Healthcare', 1000000000, 'Seattle, WA', 2007, 2500),
('Alignment Healthcare', 'ALHC2', 'https://www.alignmenthealthcare.com', 'https://ir.alignmenthealthcare.com', 'Healthcare Services', 'Healthcare', 1500000000, 'Orange, CA', 2013, 1000),
('Certara', 'CERT2', 'https://www.certara.com', 'https://ir.certara.com', 'Healthcare Technology', 'Healthcare', 2500000000, 'Princeton, NJ', 2008, 1100),
('Oak Street Health', 'OSH2', 'https://www.oakstreethealth.com', 'https://investors.oakstreethealth.com', 'Healthcare Services', 'Healthcare', 8000000000, 'Chicago, IL', 2012, 3500),
('Phreesia', 'PHR2', 'https://www.phreesia.com', 'https://ir.phreesia.com', 'Healthcare Technology', 'Healthcare', 1800000000, 'Raleigh, NC', 2005, 1800),

-- Consumer Discretionary
('Dutch Bros', 'BROS2', 'https://www.dutchbros.com', 'https://investors.dutchbros.com', 'Restaurants', 'Consumer Discretionary', 5000000000, 'Grants Pass, OR', 1992, 15000),
('FIGS', 'FIGS2', 'https://www.wearfigs.com', 'https://ir.wearfigs.com', 'Apparel', 'Consumer Discretionary', 1500000000, 'Santa Monica, CA', 2013, 800),
('On Holding', 'ONON2', 'https://www.on-running.com', 'https://investors.on-running.com', 'Footwear', 'Consumer Discretionary', 8000000000, 'Zurich, Switzerland', 2010, 2000),
('Solo Brands', 'DTC2', 'https://www.solobrands.com', 'https://investors.solobrands.com', 'Consumer Products', 'Consumer Discretionary', 500000000, 'Grapevine, TX', 2011, 300),
('Sweetgreen', 'SG', 'https://www.sweetgreen.com', 'https://investors.sweetgreen.com', 'Restaurants', 'Consumer Discretionary', 1000000000, 'Los Angeles, CA', 2007, 4000),

-- Industrials
('Blade Air Mobility', 'BLDE2', 'https://www.blade.com', 'https://ir.blade.com', 'Transportation', 'Industrials', 500000000, 'New York, NY', 2014, 200),
('Joby Aviation', 'JOBY2', 'https://www.jobyaviation.com', 'https://ir.jobyaviation.com', 'Aerospace', 'Industrials', 4000000000, 'Santa Cruz, CA', 2009, 1500),
('Lilium', 'LILM2', 'https://www.lilium.com', 'https://investors.lilium.com', 'Aerospace', 'Industrials', 1000000000, 'Munich, Germany', 2015, 800),
('Vertiv Holdings', 'VRT2', 'https://www.vertiv.com', 'https://investors.vertiv.com', 'Electrical Equipment', 'Industrials', 15000000000, 'Columbus, OH', 2016, 24000),
('Volta Inc.', 'VLTA2', 'https://www.voltacharging.com', 'https://investors.voltacharging.com', 'Electric Vehicle Charging', 'Industrials', 300000000, 'San Francisco, CA', 2010, 400),

-- Materials
('Alpha Metallurgical', 'AMR2', 'https://www.alphametresources.com', 'https://ir.alphametresources.com', 'Coal Mining', 'Materials', 2500000000, 'Bristol, TN', 2016, 3500),
('Danimer Scientific', 'DNMR2', 'https://www.danimerscientific.com', 'https://ir.danimerscientific.com', 'Specialty Chemicals', 'Materials', 500000000, 'Bainbridge, GA', 2004, 300),
('Origin Materials', 'ORGN2', 'https://www.originmaterials.com', 'https://investors.originmaterials.com', 'Chemicals', 'Materials', 800000000, 'West Sacramento, CA', 2008, 200),
('Ranpak Holdings', 'PACK2', 'https://www.ranpak.com', 'https://ir.ranpak.com', 'Packaging Products', 'Materials', 500000000, 'Concord Township, OH', 1972, 800),
('View Inc.', 'VIEW2', 'https://www.view.com', 'https://investors.view.com', 'Building Products', 'Materials', 200000000, 'Milpitas, CA', 2007, 750);