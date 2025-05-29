import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Presentation } from '../types';
import PresentationGrid from '../components/PresentationGrid';
import { ChevronLeft, Filter, Search, X } from 'lucide-react';

const CompanyPresentationsPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [company, setCompany] = useState<any>(null);
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    fetchCompanyAndPresentations();
  }, [symbol]);

  const fetchCompanyAndPresentations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch company details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('symbol', symbol)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);

      // Fetch company's presentations
      const { data: presentationsData, error: presentationsError } = await supabase
        .from('presentations')
        .select('*')
        .eq('company_symbol', symbol)
        .order('date', { ascending: false });

      if (presentationsError) throw presentationsError;

      // Extract unique tags from all presentations
      const tags = Array.from(new Set(
        presentationsData.flatMap(p => p.tags || [])
      )).sort();
      setAvailableTags(tags);

      setPresentations(presentationsData || []);
    } catch (err) {
      setError('Failed to load company presentations');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPresentations = presentations.filter(presentation => {
    const matchesSearch = presentation.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => presentation.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading presentations...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900 mb-2">Error</h3>
          <p className="text-slate-600">{error || 'Company not found'}</p>
          <Link
            to="/explore"
            className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 p-6">
            <Link 
              to={`/company/${symbol}`}
              className="inline-flex items-center text-sm text-slate-600 hover:text-primary-600 mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Company Profile
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{company.name} Presentations</h1>
                <p className="mt-1 text-sm text-slate-500">
                  View and filter all presentations from {company.name}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="search"
                    placeholder="Search presentations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-600">Filter by tags:</span>
              </div>
            </div>

            {/* Tags */}
            {availableTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex items-center text-sm px-3 py-1 rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Presentations Grid */}
          <div className="p-6">
            {filteredPresentations.length > 0 ? (
              <PresentationGrid 
                presentations={filteredPresentations}
                columns={3}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">No presentations found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPresentationsPage;