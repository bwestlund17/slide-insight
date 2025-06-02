import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, ArrowUpRight } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'business', name: 'Business' },
  { id: 'education', name: 'Education' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'sales', name: 'Sales' },
  { id: 'creative', name: 'Creative' },
  { id: 'pitch', name: 'Pitch Decks' }
];

const templates = [
  {
    id: 'template-1',
    title: 'Business Pitch Deck',
    description: 'Perfect for startup fundraising and investor presentations',
    thumbnailUrl: 'https://picsum.photos/seed/template1/800/450',
    category: 'pitch',
    slideCount: 15,
    isPremium: false
  },
  {
    id: 'template-2',
    title: 'Company Overview',
    description: 'Present your company structure, mission and vision',
    thumbnailUrl: 'https://picsum.photos/seed/template2/800/450',
    category: 'business',
    slideCount: 12,
    isPremium: false
  },
  {
    id: 'template-3',
    title: 'Marketing Strategy',
    description: 'Outline your marketing plan, targets and KPIs',
    thumbnailUrl: 'https://picsum.photos/seed/template3/800/450',
    category: 'marketing',
    slideCount: 18,
    isPremium: true
  },
  {
    id: 'template-4',
    title: 'Sales Proposal',
    description: 'Professional template for client proposals and sales pitches',
    thumbnailUrl: 'https://picsum.photos/seed/template4/800/450',
    category: 'sales',
    slideCount: 10,
    isPremium: false
  },
  {
    id: 'template-5',
    title: 'Educational Course',
    description: 'Structured template for educational content and lessons',
    thumbnailUrl: 'https://picsum.photos/seed/template5/800/450',
    category: 'education',
    slideCount: 24,
    isPremium: true
  },
  {
    id: 'template-6',
    title: 'Portfolio Showcase',
    description: 'Showcase your work with this creative portfolio template',
    thumbnailUrl: 'https://picsum.photos/seed/template6/800/450',
    category: 'creative',
    slideCount: 14,
    isPremium: false
  },
  {
    id: 'template-7',
    title: 'Annual Report',
    description: 'Comprehensive template for annual company reports',
    thumbnailUrl: 'https://picsum.photos/seed/template7/800/450',
    category: 'business',
    slideCount: 22,
    isPremium: true
  },
  {
    id: 'template-8',
    title: 'Product Launch',
    description: 'Introduce your new product with this impactful template',
    thumbnailUrl: 'https://picsum.photos/seed/template8/800/450',
    category: 'marketing',
    slideCount: 16,
    isPremium: false
  },
  {
    id: 'template-9',
    title: 'Investor Deck - Series A',
    description: 'Detailed template for Series A funding presentations',
    thumbnailUrl: 'https://picsum.photos/seed/template9/800/450',
    category: 'pitch',
    slideCount: 20,
    isPremium: true
  }
];

const TemplatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Templates Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Templates Gallery</h1>
            <p className="mt-1 text-sm text-gray-500">
              Choose from our professional templates to kickstart your presentations
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="search"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex space-x-1 border border-gray-300 rounded-lg p-1 bg-white">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Templates grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[16/9] bg-gray-100">
                  <img 
                    src={template.thumbnailUrl} 
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                  {template.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      PREMIUM
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      <Link 
                        to={`/editor/new?template=${template.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Use Template
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {template.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{template.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{template.slideCount} slides</span>
                    <Link 
                      to={`/editor/new?template=${template.id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Use Template
                      <ArrowUpRight size={12} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredTemplates.map(template => (
                <li key={template.id} className="hover:bg-gray-50">
                  <div className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0 h-16 w-24 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={template.thumbnailUrl} 
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{template.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{template.description}</p>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-500">{template.slideCount} slides</span>
                        {template.isPremium && (
                          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link
                        to={`/editor/new?template=${template.id}`}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        Use Template
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;