import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Search, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface Presentation {
  id: string;
  title: string;
  date: string;
  company: {
    name: string;
    symbol: string;
    industry: string;
  };
  description: string;
  thumbnail_url: string;
  url: string;
}

const ITEMS_PER_PAGE = 20;

const PresentationsListPage: React.FC = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  useEffect(() => {
    fetchPresentations();
    fetchIndustries();
  }, [currentPage, selectedIndustries, searchQuery]);

  const fetchPresentations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('presentations')
        .select(`
          *,
          companies!inner (
            name,
            symbol,
            industry
          )
        `)
        .order('companies.name', { ascending: true })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (selectedIndustries.length > 0) {
        query = query.in('companies.industry', selectedIndustries);
      }

      if (searchQuery) {
        query = query.or(`companies.name.ilike.%${searchQuery}%,companies.symbol.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setPresentations(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching presentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('industry')
        .not('industry', 'is', null);

      if (error) throw error;

      const uniqueIndustries = Array.from(new Set(data.map(d => d.industry))).sort();
      setIndustries(uniqueIndustries);
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedIndustries([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(i);
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pages.push('...');
      }
    }

    return pages.map((page, index) => 
      typeof page === 'number' ? (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded-md ${
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {page}
        </button>
      ) : (
        <span key={index} className="px-2">...</span>
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">Company Presentations</h1>
            
            {/* Search and Filters */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="search"
                    placeholder="Search by company name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </form>

              <div className="relative">
                <button
                  onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center"
                >
                  Industry Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>

                {showIndustryDropdown && (
                  <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
                    {industries.map(industry => (
                      <label
                        key={industry}
                        className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIndustries.includes(industry)}
                          onChange={() => handleIndustryToggle(industry)}
                          className="h-4 w-4 text-primary-600 rounded border-slate-300"
                        />
                        <span className="ml-2 text-sm text-slate-700">{industry}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {(selectedIndustries.length > 0 || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="btn btn-outline py-2 px-4 text-sm"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Selected Filters */}
            {selectedIndustries.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedIndustries.map(industry => (
                  <span
                    key={industry}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700"
                  >
                    {industry}
                    <button
                      onClick={() => handleIndustryToggle(industry)}
                      className="ml-2 hover:text-primary-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Presentations Grid */}
          {loading ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-200 h-48 rounded-lg mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {presentations.map(presentation => (
                  <div
                    key={presentation.id}
                    className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-slate-100">
                      <img
                        src={presentation.thumbnail_url}
                        alt={presentation.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-slate-900">
                            {presentation.company.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {presentation.company.industry}
                          </p>
                        </div>
                        <span className="text-sm text-slate-500">
                          {format(new Date(presentation.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                        {presentation.title}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <Link
                          to={`/presentation/${presentation.id}`}
                          className="btn btn-outline py-1.5 px-3 text-sm"
                        >
                          <FileText className="h-4 w-4 mr-1.5" />
                          View
                        </Link>
                        <a
                          href={presentation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary py-1.5 px-3 text-sm"
                        >
                          <Download className="h-4 w-4 mr-1.5" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {renderPagination()}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationsListPage;