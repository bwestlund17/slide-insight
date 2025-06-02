import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MaDeckGrid from '../components/MaDeckGrid';
import MaDeckCategorySidebar from '../components/MaDeckCategorySidebar';
import { MaDeck, SortOption, ViewMode } from '../types';
import { Search, Filter, Grid, List, ArrowDown, ArrowUp } from 'lucide-react';

// Mock data for demonstration
const MOCK_CATEGORIES = [
  { id: 'acquisition', name: 'Acquisition', count: 45 },
  { id: 'merger', name: 'Merger', count: 32 },
  { id: 'joint-venture', name: 'Joint Venture', count: 18 },
  { id: 'private-equity', name: 'Private Equity', count: 27 },
  { id: 'divestiture', name: 'Divestiture', count: 15 },
  { id: 'hostile-takeover', name: 'Hostile Takeover', count: 8 },
  { id: 'leveraged-buyout', name: 'Leveraged Buyout', count: 12 },
];

const MOCK_DEAL_TYPES = [
  { id: 'horizontal', name: 'Horizontal', count: 35 },
  { id: 'vertical', name: 'Vertical', count: 28 },
  { id: 'conglomerate', name: 'Conglomerate', count: 19 },
  { id: 'strategic', name: 'Strategic', count: 42 },
  { id: 'financial', name: 'Financial', count: 31 },
];

// Mock decks for demonstration
const generateMockDecks = (count: number): MaDeck[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `deck-${i + 1}`,
    title: `${['Strategic', 'Cross-Border', 'Innovative', 'Transformative'][i % 4]} ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name} Presentation`,
    category: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name,
    subcategory: i % 3 === 0 ? 'Industry Focus' : undefined,
    description: `Comprehensive M&A deck focusing on ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name.toLowerCase()} strategies and integration planning.`,
    thumbnailUrl: `https://picsum.photos/seed/${i + 100}/800/600`,
    slideCount: 20 + (i % 20),
    downloadCount: 100 + (i * 43) % 2000,
    rating: 3.5 + (i % 5) * 0.3,
    ratingCount: 10 + (i * 7) % 100,
    format: i % 3 === 0 ? ['PDF', 'PowerPoint'] : ['PowerPoint'],
    fileSize: `${2 + (i % 8)}MB`,
    createdAt: new Date(Date.now() - (i * 86400000 * (i % 10))).toISOString(),
    updatedAt: new Date(Date.now() - (i * 43200000 * (i % 5))).toISOString(),
    isNew: i < 5,
    isPremium: i % 7 === 0,
    isFeatured: i % 11 === 0,
    isPopular: i % 5 === 0,
    isFavorite: i % 13 === 0,
    slides: Array.from({ length: 20 + (i % 20) }, (_, j) => ({
      id: `slide-${i}-${j}`,
      deckId: `deck-${i + 1}`,
      slideNumber: j + 1,
      imageUrl: `https://picsum.photos/seed/${i * 100 + j}/800/600`,
      title: j === 0 ? `${['Strategic', 'Cross-Border', 'Innovative', 'Transformative'][i % 4]} ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name}` : undefined,
      description: j === 0 ? `Slide ${j + 1} overview` : undefined,
    })),
    tags: [
      MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name,
      MOCK_DEAL_TYPES[i % MOCK_DEAL_TYPES.length].name,
      i % 2 === 0 ? 'Due Diligence' : 'Integration',
      i % 3 === 0 ? 'Synergies' : 'Valuation',
    ],
    company: i % 4 === 0 ? {
      name: `Company ${i % 10}`,
      logo: `https://picsum.photos/seed/${i * 200}/200/200`
    } : undefined,
    dealValue: i % 3 === 0 ? `$${(i * 100 + 500)}M` : undefined,
    dealDate: i % 5 === 0 ? new Date(Date.now() - (i * 86400000 * 30)).toISOString() : undefined,
    dealType: MOCK_DEAL_TYPES[i % MOCK_DEAL_TYPES.length].name,
  }));
};

const MaDecksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [decks, setDecks] = useState<MaDeck[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<MaDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDealTypes, setSelectedDealTypes] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse query parameters
  useEffect(() => {
    const category = searchParams.get('category');
    const dealType = searchParams.get('dealType');
    const query = searchParams.get('q');
    const sort = searchParams.get('sort') as SortOption;
    const direction = searchParams.get('direction');
    const view = searchParams.get('view') as ViewMode;
    
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
  }, [searchParams]);

  // Fetch mock decks
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockDecks = generateMockDecks(24);
      setDecks(mockDecks);
      setLoading(false);
    }, 800);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    if (!decks.length) return;
    
    let result = [...decks];
    
    // Apply category filter
    if (selectedCategories.length) {
      result = result.filter(deck => 
        selectedCategories.includes(deck.category)
      );
    }
    
    // Apply deal type filter
    if (selectedDealTypes.length) {
      result = result.filter(deck => 
        deck.dealType && selectedDealTypes.includes(deck.dealType)
      );
    }
    
    // Apply format filter
    if (selectedFormats.length) {
      result = result.filter(deck => 
        deck.format.some(format => selectedFormats.includes(format))
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deck => 
        deck.title.toLowerCase().includes(query) ||
        deck.description.toLowerCase().includes(query) ||
        deck.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (deck.company?.name.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortOption) {
        case 'popular':
          comparison = a.downloadCount - b.downloadCount;
          break;
        case 'recent':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'slides':
          comparison = a.slideCount - b.slideCount;
          break;
        default:
          comparison = a.downloadCount - b.downloadCount;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
    
    setFilteredDecks(result);
  }, [decks, selectedCategories, selectedDealTypes, selectedFormats, searchQuery, sortOption, sortDirection]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      updateSearchParams({ category: newCategories.length === 1 ? newCategories[0] : null });
      return newCategories;
    });
  };

  const handleDealTypeChange = (dealType: string) => {
    setSelectedDealTypes(prev => {
      const newDealTypes = prev.includes(dealType)
        ? prev.filter(dt => dt !== dealType)
        : [...prev, dealType];
      
      updateSearchParams({ dealType: newDealTypes.length === 1 ? newDealTypes[0] : null });
      return newDealTypes;
    });
  };

  const handleFormatChange = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format)
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedDealTypes([]);
    setSelectedFormats([]);
    updateSearchParams({ category: null, dealType: null });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ q: searchQuery || null });
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
          {(selectedCategories.length > 0 || selectedDealTypes.length > 0 || selectedFormats.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">Filters:</span>
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
              categories={MOCK_CATEGORIES}
              dealTypes={MOCK_DEAL_TYPES}
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
            {loading ? (
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
            ) : (
              <>
                <div className="mb-4 text-sm text-slate-500">
                  Showing {filteredDecks.length} results
                </div>
                <MaDeckGrid 
                  decks={filteredDecks}
                  columns={viewMode === 'list' ? 2 : 3}
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MaDecksPage;