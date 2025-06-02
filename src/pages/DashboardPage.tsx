import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Layout, 
  Filter, 
  ChevronDown, 
  Clock, 
  Edit,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import DeckCard from '../components/slidebook/DeckCard';

// Mock data for presentations
const mockPresentations = [
  {
    id: 'pres-1',
    title: 'Q2 2023 Company Update',
    thumbnailUrl: 'https://picsum.photos/seed/pres1/800/450',
    slideCount: 24,
    lastEdited: new Date(Date.now() - 3600000).toISOString(),
    views: 145,
    tags: ['Business', 'Quarterly', 'Internal']
  },
  {
    id: 'pres-2',
    title: 'Product Roadmap 2023-2024',
    thumbnailUrl: 'https://picsum.photos/seed/pres2/800/450',
    slideCount: 18,
    lastEdited: new Date(Date.now() - 86400000).toISOString(),
    views: 89,
    tags: ['Product', 'Roadmap', 'Planning']
  },
  {
    id: 'pres-3',
    title: 'Investor Pitch Deck',
    thumbnailUrl: 'https://picsum.photos/seed/pres3/800/450',
    slideCount: 15,
    lastEdited: new Date(Date.now() - 259200000).toISOString(),
    views: 352,
    tags: ['Pitch', 'Investors', 'Funding']
  },
  {
    id: 'pres-4',
    title: 'Team Onboarding',
    thumbnailUrl: 'https://picsum.photos/seed/pres4/800/450',
    slideCount: 12,
    lastEdited: new Date(Date.now() - 604800000).toISOString(),
    views: 67,
    tags: ['HR', 'Onboarding', 'Training']
  },
  {
    id: 'pres-5',
    title: 'Marketing Strategy 2023',
    thumbnailUrl: 'https://picsum.photos/seed/pres5/800/450',
    slideCount: 21,
    lastEdited: new Date(Date.now() - 1209600000).toISOString(),
    views: 124,
    tags: ['Marketing', 'Strategy']
  },
  {
    id: 'pres-6',
    title: 'Annual Sales Review',
    thumbnailUrl: 'https://picsum.photos/seed/pres6/800/450',
    slideCount: 32,
    lastEdited: new Date(Date.now() - 2592000000).toISOString(),
    views: 93,
    tags: ['Sales', 'Annual', 'Review']
  }
];

type SortOption = 'recent' | 'name' | 'views' | 'slides';
type ViewMode = 'grid' | 'list';

const DashboardPage: React.FC = () => {
  const [presentations, setPresentations] = useState(mockPresentations);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // Extract unique tags from all presentations
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    presentations.forEach(pres => {
      pres.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [presentations]);
  
  // Filter presentations based on search query and selected tags
  const filteredPresentations = presentations.filter(pres => {
    const matchesSearch = pres.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => pres.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });
  
  // Sort presentations
  const sortedPresentations = React.useMemo(() => {
    return [...filteredPresentations].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title) * direction;
        case 'views':
          return (a.views - b.views) * direction;
        case 'slides':
          return (a.slideCount - b.slideCount) * direction;
        case 'recent':
        default:
          return (new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()) * direction;
      }
    });
  }, [filteredPresentations, sortBy, sortDirection]);
  
  // Toggle sort direction when clicking the same sort option
  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
    setShowSortOptions(false);
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Handle presentation duplication
  const handleDuplicate = (id: string) => {
    const presentationToDuplicate = presentations.find(p => p.id === id);
    if (presentationToDuplicate) {
      const duplicate = {
        ...presentationToDuplicate,
        id: `pres-${Date.now()}`,
        title: `${presentationToDuplicate.title} (Copy)`,
        lastEdited: new Date().toISOString(),
        views: 0
      };
      setPresentations([duplicate, ...presentations]);
    }
  };
  
  // Handle presentation deletion
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this presentation?')) {
      setPresentations(presentations.filter(p => p.id !== id));
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">My Presentations</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create, edit and share your presentations
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Actions and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="search"
                placeholder="Search presentations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium inline-flex items-center hover:bg-gray-50"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <Clock size={16} className="mr-2" />
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                <ChevronDown size={16} className="ml-2" />
              </button>
              
              {showSortOptions && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    onClick={() => handleSortChange('recent')}
                  >
                    <span>Recent</span>
                    {sortBy === 'recent' && (
                      sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                    )}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    onClick={() => handleSortChange('name')}
                  >
                    <span>Name</span>
                    {sortBy === 'name' && (
                      sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                    )}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    onClick={() => handleSortChange('views')}
                  >
                    <span>Views</span>
                    {sortBy === 'views' && (
                      sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                    )}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    onClick={() => handleSortChange('slides')}
                  >
                    <span>Slides</span>
                    {sortBy === 'slides' && (
                      sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                    )}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
            
            <Link
              to="/editor/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-1.5" />
              New Presentation
            </Link>
          </div>
        </div>
        
        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Filter size={16} className="text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Filter by tag:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {sortedPresentations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Layout className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No presentations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedTags.length > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by creating a new presentation'}
            </p>
            <div className="mt-6">
              <Link
                to="/editor/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="-ml-1 mr-2" />
                New Presentation
              </Link>
            </div>
          </div>
        )}
        
        {/* Presentations grid */}
        {sortedPresentations.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedPresentations.map(presentation => (
              <DeckCard
                key={presentation.id}
                id={presentation.id}
                title={presentation.title}
                thumbnailUrl={presentation.thumbnailUrl}
                slideCount={presentation.slideCount}
                lastEdited={presentation.lastEdited}
                views={presentation.views}
                onDuplicate={() => handleDuplicate(presentation.id)}
                onDelete={() => handleDelete(presentation.id)}
              />
            ))}
          </div>
        )}
        
        {/* Presentations list */}
        {sortedPresentations.length > 0 && viewMode === 'list' && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presentation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slides
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Edited
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedPresentations.map(presentation => (
                  <tr key={presentation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-16 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={presentation.thumbnailUrl} 
                            alt={presentation.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <Link to={`/editor/${presentation.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                            {presentation.title}
                          </Link>
                          <div className="flex mt-1 space-x-1">
                            {presentation.tags?.map(tag => (
                              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presentation.slideCount} slides
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>
                          {new Date(presentation.lastEdited).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presentation.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/editor/${presentation.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(presentation.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;