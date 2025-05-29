/*
  # Add fifth batch of S&P 500 companies

  1. Changes
    - Add another batch of S&P 500 companies
    - Include complete company information
    - Maintain data validation constraints
    - Remove duplicates from previous migrations

  2. Notes
    - Market cap values are in USD
    - All companies are part of the S&P 500 index
    - Data includes sector, industry, and other key metrics
*/

INSERT INTO companies (name, symbol, website, ir_url, industry, sector, market_cap, headquarters, founded_year, employee_count) VALUES
-- Technology
('Cisco Systems', 'CSCO', 'https://www.cisco.com', 'https://investor.cisco.com', 'Networking Equipment', 'Technology', 195000000000, 'San Jose, CA', 1984, 83300),
('Oracle Corporation', 'ORCL', 'https://www.oracle.com', 'https://investor.oracle.com', 'Software', 'Technology', 310000000000, 'Austin, TX', 1977, 164000),
('IBM', 'IBM', 'https://www.ibm.com', 'https://www.ibm.com/investor', 'IT Services', 'Technology', 170000000000, 'Armonk, NY', 1911, 350600),
('Broadcom', 'AVGO', 'https://www.broadcom.com', 'https://investors.broadcom.com', 'Semiconductors', 'Technology', 380000000000, 'San Jose, CA', 1961, 20000),
('Applied Materials', 'AMAT', 'https://www.appliedmaterials.com', 'https://ir.appliedmaterials.com', 'Semiconductor Equipment', 'Technology', 145000000000, 'Santa Clara, CA', 1967, 33000),

-- Healthcare
('Bristol Myers Squibb', 'BMY', 'https://www.bms.com', 'https://www.bms.com/investors.html', 'Pharmaceuticals', 'Healthcare', 120000000000, 'New York, NY', 1887, 34300),
('Zoetis', 'ZTS', 'https://www.zoetis.com', 'https://investor.zoetis.com', 'Animal Health', 'Healthcare', 85000000000, 'Parsippany, NJ', 1952, 13000),
('Elevance Health', 'ELV', 'https://www.elevancehealth.com', 'https://ir.elevancehealth.com', 'Healthcare Insurance', 'Healthcare', 110000000000, 'Indianapolis, IN', 1944, 102000),
('Cigna', 'CI', 'https://www.cigna.com', 'https://investors.cigna.com', 'Healthcare Insurance', 'Healthcare', 95000000000, 'Bloomfield, CT', 1792, 70000),
('Humana', 'HUM', 'https://www.humana.com', 'https://humana.gcs-web.com', 'Healthcare Insurance', 'Healthcare', 60000000000, 'Louisville, KY', 1961, 67000),

-- Financial Services
('Wells Fargo', 'WFC', 'https://www.wellsfargo.com', 'https://www.wellsfargo.com/about/investor-relations', 'Banking', 'Financial Services', 180000000000, 'San Francisco, CA', 1852, 238000),
('Citigroup', 'C', 'https://www.citigroup.com', 'https://www.citigroup.com/global/investors', 'Banking', 'Financial Services', 95000000000, 'New York, NY', 1812, 240000),
('U.S. Bancorp', 'USB', 'https://www.usbank.com', 'https://ir.usbank.com', 'Banking', 'Financial Services', 65000000000, 'Minneapolis, MN', 1863, 70000),
('PNC Financial', 'PNC', 'https://www.pnc.com', 'https://thepncfinancialservicesgroupinc.gcs-web.com', 'Banking', 'Financial Services', 55000000000, 'Pittsburgh, PA', 1852, 59000),
('Capital One', 'COF', 'https://www.capitalone.com', 'https://investor.capitalone.com', 'Consumer Finance', 'Financial Services', 45000000000, 'McLean, VA', 1988, 56000),

-- Consumer Discretionary
('Booking Holdings', 'BKNG', 'https://www.bookingholdings.com', 'https://ir.bookingholdings.com', 'Travel Services', 'Consumer Discretionary', 120000000000, 'Norwalk, CT', 1996, 20000),
('Marriott International', 'MAR', 'https://www.marriott.com', 'https://marriott.gcs-web.com', 'Hotels', 'Consumer Discretionary', 70000000000, 'Bethesda, MD', 1927, 377000),
('Hilton Worldwide', 'HLT', 'https://www.hilton.com', 'https://ir.hilton.com', 'Hotels', 'Consumer Discretionary', 45000000000, 'McLean, VA', 1919, 159000),

-- Industrials
('Lockheed Martin', 'LMT', 'https://www.lockheedmartin.com', 'https://investors.lockheedmartin.com', 'Aerospace & Defense', 'Industrials', 115000000000, 'Bethesda, MD', 1995, 116000),
('Northrop Grumman', 'NOC', 'https://www.northropgrumman.com', 'https://investor.northropgrumman.com', 'Aerospace & Defense', 'Industrials', 75000000000, 'Falls Church, VA', 1939, 95000),
('General Dynamics', 'GD', 'https://www.gd.com', 'https://investorrelations.gd.com', 'Aerospace & Defense', 'Industrials', 65000000000, 'Reston, VA', 1952, 100000),
('CSX Corporation', 'CSX', 'https://www.csx.com', 'https://investors.csx.com', 'Railroads', 'Industrials', 65000000000, 'Jacksonville, FL', 1827, 20500),
('Norfolk Southern', 'NSC', 'https://www.nscorp.com', 'https://www.norfolksouthern.com/investors', 'Railroads', 'Industrials', 50000000000, 'Atlanta, GA', 1982, 19300),

-- Materials
('Ecolab', 'ECL', 'https://www.ecolab.com', 'https://investor.ecolab.com', 'Specialty Chemicals', 'Materials', 50000000000, 'Saint Paul, MN', 1923, 47000),
('DuPont', 'DD', 'https://www.dupont.com', 'https://www.investors.dupont.com', 'Specialty Chemicals', 'Materials', 35000000000, 'Wilmington, DE', 1802, 35000),
('International Paper', 'IP', 'https://www.internationalpaper.com', 'https://investor.internationalpaper.com', 'Paper Products', 'Materials', 15000000000, 'Memphis, TN', 1898, 39000),
('Ball Corporation', 'BALL', 'https://www.ball.com', 'https://investors.ball.com', 'Containers & Packaging', 'Materials', 20000000000, 'Westminster, CO', 1880, 21500),
('Celanese', 'CE', 'https://www.celanese.com', 'https://investors.celanese.com', 'Specialty Chemicals', 'Materials', 15000000000, 'Irving, TX', 1918, 13000);