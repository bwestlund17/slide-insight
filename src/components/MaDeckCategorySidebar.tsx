import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Search } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  count: number;
}

interface MaDeckCategorySidebarProps {
  categories: CategoryItem[];
  dealTypes: CategoryItem[];
  selectedCategories: string[];
  selectedDealTypes: string[];
  selectedFormats: string[];
  onCategoryChange: (category: string) => void;
  onDealTypeChange: (dealType: string) => void;
  onFormatChange: (format: string) => void;
  onClearFilters: () => void;
}

const MaDeckCategorySidebar: React.FC<MaDeckCategorySidebarProps> = ({
  categories,
  dealTypes,
  selectedCategories,
  selectedDealTypes,
  selectedFormats,
  onCategoryChange,
  onDealTypeChange,
  onFormatChange,
  onClearFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    dealTypes: true,
    formats: true,
  });
  const [categorySearch, setCategorySearch] = useState('');
  const [dealTypeSearch, setDealTypeSearch] = useState('');

  const toggleSection = (section: 'categories' | 'dealTypes' | 'formats') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredDealTypes = dealTypes.filter(dealType => 
    dealType.name.toLowerCase().includes(dealTypeSearch.toLowerCase())
  );

  const formats = [
    { id: 'powerpoint', name: 'PowerPoint', count: 120 },
    { id: 'pdf', name: 'PDF', count: 95 },
    { id: 'keynote', name: 'Keynote', count: 45 },
    { id: 'google-slides', name: 'Google Slides', count: 30 },
  ];

  const hasActiveFilters = selectedCategories.length > 0 || selectedDealTypes.length > 0 || selectedFormats.length > 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden sticky top-24">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-medium text-slate-900">Filters</h3>
        {hasActiveFilters && (
          <button
            className="text-xs text-primary-600 hover:text-primary-700"
            onClick={onClearFilters}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories Section */}
      <div className="border-b border-slate-200">
        <button
          className="w-full p-4 flex justify-between items-center hover:bg-slate-50"
          onClick={() => toggleSection('categories')}
        >
          <span className="font-medium text-sm">Categories</span>
          {expandedSections.categories ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="p-4 pt-2 space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              {categorySearch && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-500"
                  onClick={() => setCategorySearch('')}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => onCategoryChange(category.name)}
                      className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm text-slate-700 flex-1"
                    >
                      {category.name}
                    </label>
                    <span className="text-xs text-slate-500">{category.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-2">
                  No categories found
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Deal Types Section */}
      <div className="border-b border-slate-200">
        <button
          className="w-full p-4 flex justify-between items-center hover:bg-slate-50"
          onClick={() => toggleSection('dealTypes')}
        >
          <span className="font-medium text-sm">Deal Types</span>
          {expandedSections.dealTypes ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>
        {expandedSections.dealTypes && (
          <div className="p-4 pt-2 space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search deal types..."
                value={dealTypeSearch}
                onChange={(e) => setDealTypeSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              {dealTypeSearch && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-500"
                  onClick={() => setDealTypeSearch('')}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {filteredDealTypes.length > 0 ? (
                filteredDealTypes.map((dealType) => (
                  <div key={dealType.id} className="flex items-center">
                    <input
                      id={`dealType-${dealType.id}`}
                      type="checkbox"
                      checked={selectedDealTypes.includes(dealType.name)}
                      onChange={() => onDealTypeChange(dealType.name)}
                      className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
                    />
                    <label
                      htmlFor={`dealType-${dealType.id}`}
                      className="ml-2 text-sm text-slate-700 flex-1"
                    >
                      {dealType.name}
                    </label>
                    <span className="text-xs text-slate-500">{dealType.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-2">
                  No deal types found
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Formats Section */}
      <div>
        <button
          className="w-full p-4 flex justify-between items-center hover:bg-slate-50"
          onClick={() => toggleSection('formats')}
        >
          <span className="font-medium text-sm">Formats</span>
          {expandedSections.formats ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>
        {expandedSections.formats && (
          <div className="p-4 space-y-2">
            {formats.map((format) => (
              <div key={format.id} className="flex items-center">
                <input
                  id={`format-${format.id}`}
                  type="checkbox"
                  checked={selectedFormats.includes(format.name)}
                  onChange={() => onFormatChange(format.name)}
                  className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
                />
                <label
                  htmlFor={`format-${format.id}`}
                  className="ml-2 text-sm text-slate-700 flex-1"
                >
                  {format.name}
                </label>
                <span className="text-xs text-slate-500">{format.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaDeckCategorySidebar;