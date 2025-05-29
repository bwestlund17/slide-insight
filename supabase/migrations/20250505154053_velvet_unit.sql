/*
  # Initial Company Data

  1. Changes
    - Insert initial set of companies
    - Use ON CONFLICT to handle duplicates gracefully
    - Include complete company information
*/

INSERT INTO companies (
  name, 
  symbol, 
  website, 
  ir_url, 
  industry, 
  sector, 
  market_cap, 
  headquarters, 
  founded_year, 
  employee_count
) VALUES 
-- Technology Companies
('Advanced Energy Industries', 'AEIS2', 'https://www.advanced-energy.com', 'https://www.advanced-energy.com/investors', 'Technology', 'Technology', 3500000000, 'Denver, CO', 1981, 10000),
('Alteryx', 'AYX2', 'https://www.alteryx.com', 'https://investor.alteryx.com', 'Software', 'Technology', 2800000000, 'Irvine, CA', 1997, 2000),
('Box', 'BOX2', 'https://www.box.com', 'https://www.box.com/investors', 'Software', 'Technology', 4200000000, 'Redwood City, CA', 2005, 2500),

-- Healthcare Companies
('Acadia Healthcare', 'ACHC2', 'https://www.acadiahealthcare.com', 'https://ir.acadiahealthcare.com', 'Healthcare', 'Healthcare Services', 6100000000, 'Franklin, TN', 2005, 68000),
('Addus HomeCare', 'ADUS2', 'https://www.addus.com', 'https://investors.addus.com', 'Healthcare', 'Healthcare Services', 1500000000, 'Frisco, TX', 1979, 33000),
('Amedisys', 'AMED2', 'https://www.amedisys.com', 'https://investors.amedisys.com', 'Healthcare', 'Healthcare Services', 3200000000, 'Baton Rouge, LA', 1982, 21000),

-- Financial Services Companies
('Ameris Bancorp', 'ABCB2', 'https://www.amerisbank.com', 'https://ir.amerisbank.com', 'Financial Services', 'Banks', 2900000000, 'Atlanta, GA', 1971, 3000),
('Associated Banc-Corp', 'ASB2', 'https://www.associatedbank.com', 'https://investor.associatedbank.com', 'Financial Services', 'Banks', 3100000000, 'Green Bay, WI', 1861, 4000),
('BankUnited', 'BKU2', 'https://www.bankunited.com', 'https://ir.bankunited.com', 'Financial Services', 'Banks', 2400000000, 'Miami Lakes, FL', 2009, 1500)
ON CONFLICT (symbol) DO NOTHING;