import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Presentation } from '../types';
import PresentationGrid from '../components/PresentationGrid';
import FilterSidebar from '../components/FilterSidebar';
import { SearchX, Search, X } from 'lucide-react';

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Presentation[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const q = searchParams.get('q') || '';
        const tagParam = searchParams.get('tag');
        const industryParam = searchParams.get('industry');
        
        setQuery(q);
        setSearchQuery(q);
        
        if (tagParam) {
          setSelectedTags([tagParam]);
        }
        
        if (industryParam) {
          setSelectedIndustries([industryParam]);
        }

        let query = supabase
          .from('companies')
          .select('*');

        // Add search filters
        if (q) {
          query = query.or(`name.ilike.%${q}%,symbol.ilike.%${q}%,industry.ilike.%${q}%`);
        }

        if (industryParam) {
          query = query.eq('industry', industryParam);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        // Transform the data to match the Presentation type
        const presentations = data.map(company => ({
          id: company.id,
          title: `${company.name} (${company.symbol}) - Corporate Overview`,
          companyName: company.name,
          companySymbol: company.symbol,
          companyLogo: `https://via.placeholder.com/150?text=${company.symbol}`,
          date: new Date().toISOString(),
          summary: `Overview of ${company.name}, a leading company in the ${company.industry} sector.`,
          slideCount: 30,
          fileType: 'PDF',
          fileSize: '5 MB',
          tags: [company.industry, company.sector],
          industry: company.industry,
          url: company.ir_url,
          thumbnailUrl: `https://picsum.photos/seed/${company.id}/640/360`,
          viewCount: Math.floor(Math.random() * 5000) + 50,
          isBookmarked: false
        }));

        setResults(presentations);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    if (selectedTags.length === 1) {
      params.set('tag', selectedTags[0]);
    }
    
    if (selectedIndustries.length === 1) {
      params.set('industry', selectedIndustries[0]);
    }
    
    setSearchParams(params);
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustries(prev => {
      if (prev.includes(industry)) {
        return prev.filter(i => i !== industry);
      } else {
        return [...prev, industry];
      }
    });
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedIndustries([]);
    setSelectedTags([]);
  };

  const hasActiveFilters = selectedIndustries.length > 0 || selectedTags.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Searching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <SearchX className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Error</h3>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn btn-primary px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen fade-in">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-slate-400" />
            <h1 className="text-2xl font-bold text-slate-900">
              {query ? `Search results for "${query}"` : 'Search Presentations'}
            </h1>
          </div>
          
          <form onSubmit={handleSearch} className="mt-4 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name, symbol, or industry..."
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-500"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary rounded-md px-3 py-1.5 text-sm"
              >
                Search
              </button>
            </div>
          </form>
          
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">Filters:</span>
              
              {selectedIndustries.map(industry => (
                <button
                  key={industry}
                  className="inline-flex items-center bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full hover:bg-primary-100"
                  onClick={() => handleIndustryChange(industry)}
                >
                  {industry}
                  <X className="ml-1 h-3 w-3" />
                </button>
              ))}
              
              {selectedTags.map(tag => (
                <button
                  key={tag}
                  className="inline-flex items-center bg-secondary-50 text-secondary-700 text-xs px-2 py-1 rounded-full hover:bg-secondary-100"
                  onClick={() => handleTagChange(tag)}
                >
                  {tag}
                  <X className="ml-1 h-3 w-3" />
                </button>
              ))}
              
              <button
                className="text-xs text-primary-600 hover:text-primary-800 ml-1"
                onClick={handleClearFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              industries={[]}
              tags={[]}
              selectedIndustries={selectedIndustries}
              selectedTags={selectedTags}
              onIndustryChange={handleIndustryChange}
              onTagChange={handleTagChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </div>
              
              {/* Mobile filter button */}
              <button
                className="lg:hidden flex items-center text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
                {hasActiveFilters && (
                  <span className="ml-1.5 bg-primary-100 text-primary-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                    {selectedIndustries.length + selectedTags.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 block">
                <FilterSidebar
                  industries={[]}
                  tags={[]}
                  selectedIndustries={selectedIndustries}
                  selectedTags={selectedTags}
                  onIndustryChange={handleIndustryChange}
                  onTagChange={handleTagChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}

            {/* Search results */}
            {results.length > 0 ? (
              <PresentationGrid 
                presentations={results} 
                columns={3}
              />
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <SearchX className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No results found</h3>
                <p className="text-slate-600 mb-6">
                  We couldn't find any presentations matching your search.
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">Try:</p>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Using different or fewer keywords</li>
                    <li>• Checking your spelling</li>
                    <li>• Using more general terms</li>
                    <li>• Removing filters</li>
                  </ul>
                  <Link 
                    to="/explore"
                    className="inline-block btn btn-primary px-4 py-2 mt-4"
                  >
                    Browse All Presentations
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;