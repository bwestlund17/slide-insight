/*
  # Add Russell 2000 Companies

  1. Changes
    - Insert initial set of Russell 2000 companies
    - Add sample companies for testing

  2. Notes
    - This is a subset of companies for demonstration
    - In production, you would import the full Russell 2000 list
*/

INSERT INTO companies (name, symbol, website, ir_url, industry) VALUES
-- Technology
('Innovate Micro Systems', 'INVM2', 'https://example.com/innovatemicro', 'https://example.com/innovatemicro/investors', 'Technology'),
('NextGen Network Solutions', 'NXGN2', 'https://example.com/nextgennetworks', 'https://example.com/nextgennetworks/investors', 'Technology'),
('CloudScale Technologies', 'CLSC2', 'https://example.com/cloudscale', 'https://example.com/cloudscale/investors', 'Technology'),

-- Healthcare
('MedFirst Healthcare', 'MFST2', 'https://example.com/medfirst', 'https://example.com/medfirst/investors', 'Healthcare'),
('BioTech Innovations Group', 'BTCI2', 'https://example.com/biotech', 'https://example.com/biotech/investors', 'Healthcare'),
('HealthCare Solutions Corp', 'HCSL2', 'https://example.com/healthcare', 'https://example.com/healthcare/investors', 'Healthcare'),

-- Financial Services
('Atlantic Regional Bancorp', 'ATLB2', 'https://example.com/atlanticbank', 'https://example.com/atlanticbank/investors', 'Financial Services'),
('Pacific Trust Holdings', 'PTFI2', 'https://example.com/pacifictrust', 'https://example.com/pacifictrust/investors', 'Financial Services'),
('Midwest Financial Corp', 'MWFG2', 'https://example.com/midwestfin', 'https://example.com/midwestfin/investors', 'Financial Services'),

-- Energy
('EcoSolar Technologies', 'ESOL2', 'https://example.com/ecosolar', 'https://example.com/ecosolar/investors', 'Energy'),
('Clean Energy Solutions', 'CLEC2', 'https://example.com/cleanenergy', 'https://example.com/cleanenergy/investors', 'Energy'),
('Renewable Power Corp', 'RNWP2', 'https://example.com/renewable', 'https://example.com/renewable/investors', 'Energy'),

-- Real Estate
('Urban Dwellings Trust', 'UDRT2', 'https://example.com/urbandwellings', 'https://example.com/urbandwellings/investors', 'Real Estate'),
('Commercial Property Group', 'CPRT2', 'https://example.com/commprop', 'https://example.com/commprop/investors', 'Real Estate'),
('Residential Realty Trust', 'RSRG2', 'https://example.com/residential', 'https://example.com/residential/investors', 'Real Estate');