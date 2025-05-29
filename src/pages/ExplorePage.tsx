import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import FilterSidebar from '../components/FilterSidebar';
import PresentationGrid from '../components/PresentationGrid';
import { useIndustryStats, usePresentations } from '../hooks/useQueries';
import { triggerInitialScraping } from '../lib/supabase';

export default function ExplorePage() {
  const supabase = useSupabaseClient();
  const { data: industries = [], isLoading: industriesLoading } = useIndustryStats();
  const { data: presentations = [], isLoading: presentationsLoading } = usePresentations();
  
  // State for selected filters
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique tags from all presentations
  const allTags = React.useMemo(() => {
    const tagMap = new Map<string, number>();
    presentations.forEach(presentation => {
      presentation.tags?.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count
    }));
  }, [presentations]);

  // Trigger initial scraping if no presentations exist
  useEffect(() => {
    if (!presentationsLoading && presentations.length === 0) {
      triggerInitialScraping().catch(error => {
        console.error('Failed to trigger initial scraping:', error);
        // Optionally show an error message to the user
      });
    }
  }, [presentationsLoading, presentations.length]);

  // Handler functions for filter changes
  const handleIndustryChange = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedIndustries([]);
    setSelectedTags([]);
  };

  // Filter presentations based on selected filters
  const filteredPresentations = presentations.filter(presentation => {
    const matchesIndustry = selectedIndustries.length === 0 || 
      selectedIndustries.includes(presentation.companies?.industry);
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => presentation.tags?.includes(tag));
    return matchesIndustry && matchesTags;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <FilterSidebar
              industries={industries}
              tags={allTags}
              selectedIndustries={selectedIndustries}
              selectedTags={selectedTags}
              onIndustryChange={handleIndustryChange}
              onTagChange={handleTagChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Explore Presentations</h1>
            {presentationsLoading ? (
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
              <PresentationGrid 
                presentations={filteredPresentations}
                columns={3}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}