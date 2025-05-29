import React, { useState } from 'react';
import { Industry, Tag } from '../types';
import { Search, ChevronDown, X } from 'lucide-react';

interface FilterSidebarProps {
  industries: Industry[];
  tags: Tag[];
  selectedIndustries: string[];
  selectedTags: string[];
  onIndustryChange: (industry: string) => void;
  onTagChange: (tag: string) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  industries,
  tags,
  selectedIndustries,
  selectedTags,
  onIndustryChange,
  onTagChange,
  onClearFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    industries: true,
    tags: true,
  });
  const [tagSearch, setTagSearch] = useState('');

  const toggleSection = (section: 'industries' | 'tags') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const hasActiveFilters = selectedIndustries.length > 0 || selectedTags.length > 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
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

      {/* Industries Section */}
      <div className="border-b border-slate-200">
        <button
          className="w-full p-4 flex justify-between items-center hover:bg-slate-50"
          onClick={() => toggleSection('industries')}
        >
          <span className="font-medium text-sm">Industries</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform ${
              expandedSections.industries ? 'transform rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.industries && (
          <div className="p-4 pt-0 space-y-2">
            {industries.map((industry) => (
              <div key={industry.id} className="flex items-center">
                <input
                  id={`industry-${industry.id}`}
                  type="checkbox"
                  checked={selectedIndustries.includes(industry.name)}
                  onChange={() => onIndustryChange(industry.name)}
                  className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
                />
                <label
                  htmlFor={`industry-${industry.id}`}
                  className="ml-2 text-sm text-slate-700 flex-1"
                >
                  {industry.name}
                </label>
                <span className="text-xs text-slate-500">{industry.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div>
        <button
          className="w-full p-4 flex justify-between items-center hover:bg-slate-50"
          onClick={() => toggleSection('tags')}
        >
          <span className="font-medium text-sm">Tags</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform ${
              expandedSections.tags ? 'transform rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.tags && (
          <div className="p-4 pt-2 space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              {tagSearch && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-500"
                  onClick={() => setTagSearch('')}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div key={tag.id} className="flex items-center">
                    <input
                      id={`tag-${tag.id}`}
                      type="checkbox"
                      checked={selectedTags.includes(tag.name)}
                      onChange={() => onTagChange(tag.name)}
                      className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
                    />
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="ml-2 text-sm text-slate-700 flex-1"
                    >
                      {tag.name}
                    </label>
                    <span className="text-xs text-slate-500">{tag.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-2">
                  No tags found
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;