import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PresentationGrid from '../components/PresentationGrid';
import { Building2, Globe, Users, DollarSign, Briefcase, Calendar, ExternalLink, ChevronRight } from 'lucide-react';
import { useCompanyBySymbol, usePresentationsByCompany } from '../hooks/useQueries';

const CompanyPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { data: company, isLoading: isLoadingCompany } = useCompanyBySymbol(symbol || '');
  const { data: presentations, isLoading: isLoadingPresentations } = usePresentationsByCompany(company?.id || '');

  if (isLoadingCompany || isLoadingPresentations) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Loading...</h1>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Company Not Found</h1>
        <p className="text-slate-600 mb-6">We couldn't find the company you're looking for.</p>
        <Link to="/explore" className="btn btn-primary py-2 px-4">
          Browse Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen fade-in">
      {/* Company header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="h-20 w-20 bg-slate-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{company.symbol}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                <span className="inline-flex items-center text-sm text-slate-600">
                  <Building2 className="h-4 w-4 mr-1 text-slate-400" />
                  {company.industry}
                </span>
                <span className="inline-flex items-center text-sm text-slate-600">
                  <Globe className="h-4 w-4 mr-1 text-slate-400" />
                  {company.headquarters}
                </span>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                >
                  Visit Website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
            <div>
              <a
                href={company.ir_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary py-2 px-4"
              >
                Investor Relations
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Presentations section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  Recent Presentations
                </h2>
                <Link 
                  to={`/company/${symbol}/presentations`}
                  className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                >
                  View all presentations
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <PresentationGrid 
                presentations={presentations || []}
                columns={2}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden sticky top-40">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-medium text-slate-900">Company Overview</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Founded</h4>
                      <p className="text-sm text-slate-600">{company.founded_year}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Employees</h4>
                      <p className="text-sm text-slate-600">{company.employee_count?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Market Cap</h4>
                      <p className="text-sm text-slate-600">${company.market_cap?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Industry</h4>
                      <p className="text-sm text-slate-600">{company.industry}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;