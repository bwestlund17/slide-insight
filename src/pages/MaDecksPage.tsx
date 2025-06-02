import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MaDeckGrid from '../components/MaDeckGrid';
import MaDeckCategorySidebar from '../components/MaDeckCategorySidebar';
import { SortOption, ViewMode } from '../types';
import { Search, Filter, Grid, List, ArrowDown, ArrowUp } from 'lucide-react';
import { useMaDecks, useMaDeckCategories, useMaDeckDealTypes } from '../hooks/useMaDecks';

const MaDecksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDealTypes, setSelectedDealTypes] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 24;

  // Fetch data using React Query
  const { data: categoriesData, isLoading: categoriesLoading } = useMaDeckCategories();
  const { data: dealTypesData, isLoading: dealTypesLoading } = useMaDeckDealTypes();
  
  const { 
    data: decksData, 
    isLoading: decksLoading, 
    error: decksError
  } = useMaDecks({
    limit,
    offset,
    category: selectedCategories.length === 1 ? selectedCategories[0] : null,
    dealType: selectedDealTypes.length === 1 ? selectedDealTypes[0] : null,
    searchQuery,
    sortBy: sortOption,
    sortDirection
  });

  // Parse query parameters
  useEffect(() => {
    const category = searchParams.get('category');
    const dealType = searchParams.get('dealType');
    const query = searchParams.get('q');
    const sort = searchParams.get('sort') as SortOption;
    const direction = searchParams.get('direction');
    const view = searchParams.get('view') as ViewMode;
    const page = searchParams.get('page');
    
    if (category) {
      setSelectedCategories([category]);
    }
    
    if (dealType) {
      setSelectedDealTypes([dealType]);
    }
    
    if (query) {
      setSearchQuery(query);
    }
    
    if (sort && ['popular', 'recent', 'rating', 'title', 'slides'].includes(sort)) {
      setSortOption(sort);
    }
    
    if (direction && ['asc', 'desc'].includes(direction)) {
      setSortDirection(direction as 'asc' | 'desc');
    }
    
    if (view && ['grid', 'list'].includes(view)) {
      setViewMode(view);
    }

    if (page) {
      const pageNumber = parseInt(page, 10);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        setOffset((pageNumber - 1) * limit);
      }
    }
  }, [searchParams, limit]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      updateSearchParams({ 
        category: newCategories.length === 1 ? newCategories[0] : null,
        page: '1'  // Reset to page 1 when changing filters
      });
      setOffset(0); // Reset offset
      return newCategories;
    });
  };

  const handleDealTypeChange = (dealType: string) => {
    setSelectedDealTypes(prev => {
      const newDealTypes = prev.includes(dealType)
        ? prev.filter(dt => dt !== dealType)
        : [...prev, dealType];
      
      updateSearchParams({ 
        dealType: newDealTypes.length === 1 ? newDealTypes[0] : null,
        page: '1'  // Reset to page 1 when changing filters
      });
      setOffset(0); // Reset offset
      return newDealTypes;
    });
  };

  const handleFormatChange = (format: string) => {
    setSelectedFormats(prev => {
      const newFormats = prev.includes(format)
        ? prev.filter(f => f !== format)
        : [...prev, format];
      
      // No URL param for formats yet, but we might add it
      return newFormats;
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedDealTypes([]);
    setSelectedFormats([]);
    setSearchQuery('');
    updateSearchParams({ 
      category: null, 
      dealType: null, 
      q: null,
      page: '1'
    });
    setOffset(0); // Reset offset
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ 
      q: searchQuery || null,
      page: '1'  // Reset to page 1 when searching
    });
    setOffset(0); // Reset offset
  };

  const handleSortChange = (option: SortOption) => {
    if (sortOption === option) {
      // Toggle direction if clicking the same option
      const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
      setSortDirection(newDirection);
      updateSearchParams({ direction: newDirection });
    } else {
      setSortOption(option);
      setSortDirection('desc'); // Default to desc for new sort option
      updateSearchParams({ sort: option, direction: 'desc' });
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    updateSearchParams({ view: mode });
  };

  const handlePageChange = (newPage: number) => {
    setOffset((newPage - 1) * limit);
    updateSearchParams({ page: newPage.toString() });
  };

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
  };

  const getSortButtonClass = (option: SortOption) => {
    return `px-3 py-1.5 text-sm rounded-md ${
      sortOption === option 
        ? 'bg-primary-100 text-primary-700 font-medium' 
        : 'text-slate-600 hover:bg-slate-100'
    }`;
  };

  const totalDecks = decksData?.count || 0;
  const totalPages = Math.ceil(totalDecks / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">M&A Decks</h1>
          <p className="text-slate-600">
            Browse our collection of mergers and acquisitions presentation templates from successful deals.
          </p>
        </div>
        
        {/* Search and Filters Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="search"
                  placeholder="Search M&A decks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
            
            <div className="flex items-center gap-2">
              <button 
                className="md:hidden btn btn-outline py-2 px-3 flex items-center space-x-1"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(selectedCategories.length > 0 || selectedDealTypes.length > 0 || selectedFormats.length > 0) && (
                  <span className="ml-1 bg-primary-100 text-primary-800 text-xs font-semibold px-1.5 rounded-full">
                    {selectedCategories.length + selectedDealTypes.length + selectedFormats.length}
                  </span>
                )}
              </button>
              
              <div className="hidden md:flex items-center border-l border-slate-200 pl-4">
                <span className="text-sm text-slate-500 mr-2">View:</span>
                <button 
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                  onClick={() => handleViewModeChange('grid')}
                  title="Grid View"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button 
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                  onClick={() => handleViewModeChange('list')}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <div className="flex flex-wrap gap-1">
              <button 
                className={getSortButtonClass('popular')}
                onClick={() => handleSortChange('popular')}
              >
                Popular
                {sortOption === 'popular' && (
                  sortDirection === 'desc' ? 
                    <ArrowDown className="h-3 w-3 inline-block ml-1" /> : 
                    <ArrowUp className="h-3 w-3 inline-block ml-1" />
                )}
              </button>
              <button 
                className={getSortButtonClass('recent')}
                onClick={() => handleSortChange('recent')}
              >
                Recent
                {sortOption === 'recent' && (
                  sortDirection === 'desc' ? 
                    <ArrowDown className="h-3 w-3 inline-block ml-1" /> : 
                    <ArrowUp className="h-3 w-3 inline-block ml-1" />
                )}
              </button>
              <button 
                className={getSortButtonClass('rating')}
                onClick={() => handleSortChange('rating')}
              >
                Rating
                {sortOption === 'rating' && (
                  sortDirection === 'desc' ? 
                    <ArrowDown className="h-3 w-3 inline-block ml-1" /> : 
                    <ArrowUp className="h-3 w-3 inline-block ml-1" />
                )}
              </button>
              <button 
                className={getSortButtonClass('title')}
                onClick={() => handleSortChange('title')}
              >
                Title
                {sortOption === 'title' && (
                  sortDirection === 'desc' ? 
                    <ArrowDown className="h-3 w-3 inline-block ml-1" /> : 
                    <ArrowUp className="h-3 w-3 inline-block ml-1" />
                )}
              </button>
              <button 
                className={getSortButtonClass('slides')}
                onClick={() => handleSortChange('slides')}
              >
                Slides
                {sortOption === 'slides' && (
                  sortDirection === 'desc' ? 
                    <ArrowDown className="h-3 w-3 inline-block ml-1" /> : 
                    <ArrowUp className="h-3 w-3 inline-block ml-1" />
                )}
              </button>
            </div>
          </div>
          
          {/* Selected Filters */}
          {(selectedCategories.length > 0 || selectedDealTypes.length > 0 || selectedFormats.length > 0 || searchQuery) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">Filters:</span>
              {searchQuery && (
                <span 
                  className="text-xs py-1 px-2 bg-slate-100 text-slate-700 rounded-full flex items-center"
                >
                  Search: {searchQuery}
                  <button 
                    className="ml-1 text-slate-500 hover:text-slate-700"
                    onClick={() => {
                      setSearchQuery('');
                      updateSearchParams({ q: null, page: '1' });
                      setOffset(0);
                    }}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedCategories.map(category => (
                <span 
                  key={category}
                  className="text-xs py-1 px-2 bg-primary-50 text-primary-700 rounded-full flex items-center"
                >
                  {category}
                  <button 
                    className="ml-1 text-primary-600 hover:text-primary-800"
                    onClick={() => handleCategoryChange(category)}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {selectedDealTypes.map(dealType => (
                <span 
                  key={dealType}
                  className="text-xs py-1 px-2 bg-secondary-50 text-secondary-700 rounded-full flex items-center"
                >
                  {dealType}
                  <button 
                    className="ml-1 text-secondary-600 hover:text-secondary-800"
                    onClick={() => handleDealTypeChange(dealType)}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {selectedFormats.map(format => (
                <span 
                  key={format}
                  className="text-xs py-1 px-2 bg-accent-50 text-accent-700 rounded-full flex items-center"
                >
                  {format}
                  <button 
                    className="ml-1 text-accent-600 hover:text-accent-800"
                    onClick={() => handleFormatChange(format)}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
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
          {/* Sidebar - Hidden on mobile unless explicitly shown */}
          <aside className={`lg:block w-full lg:w-64 lg:flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden'}`}>
            <MaDeckCategorySidebar
              categories={categoriesData || []}
              dealTypes={dealTypesData || []}
              selectedCategories={selectedCategories}
              selectedDealTypes={selectedDealTypes}
              selectedFormats={selectedFormats}
              onCategoryChange={handleCategoryChange}
              onDealTypeChange={handleDealTypeChange}
              onFormatChange={handleFormatChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {decksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-lg border border-slate-200">
                      <div className="h-40 bg-slate-200 rounded-t-lg"></div>
                      <div className="p-4">
                        <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-slate-200 rounded w-20"></div>
                          <div className="h-6 bg-slate-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : decksError ? (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <h3 className="text-lg font-medium text-slate-900 mb-2">Error loading decks</h3>
                <p className="text-slate-600 mb-4">
                  We encountered an issue while loading the decks. Please try again.
                </p>
                <button 
                  className="btn btn-primary px-4 py-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-slate-500">
                  Showing {decksData?.data.length || 0} of {totalDecks} results
                </div>
                <MaDeckGrid 
                  decks={decksData?.data || []}
                  columns={viewMode === 'list' ? 2 : 3}
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        
                        // Only show current page, first/last page, and pages within +/- 1 of current
                        if (
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded-md ${
                                currentPage === page
                                  ? 'bg-primary-600 text-white'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          (page === 2 && currentPage > 3) || 
                          (page === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          // Show ellipsis for skipped pages
                          return (
                            <span
                              key={page}
                              className="px-3 py-1 text-slate-400"
                            >
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MaDecksPage;