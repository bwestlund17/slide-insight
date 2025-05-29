import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, XCircle, Clock, AlertCircle, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

type ScrapingStatus = 'success' | 'failed' | 'pending' | 'in_progress';
type SortField = 'name' | 'symbol' | 'status' | 'started_at' | 'completed_at' | 'presentations_found' | 'next_scheduled';
type SortDirection = 'asc' | 'desc';

interface Company {
  id: string;
  name: string;
  symbol: string;
  website: string;
  ir_url: string;
  industry: string;
}

interface ScrapingJob {
  id: string;
  company_id: string;
  status: ScrapingStatus;
  started_at: string;
  completed_at: string | null;
  presentations_found: number;
  next_scheduled: string | null;
  error?: string;
}

interface CompanyWithStatus extends Company {
  latest_job?: ScrapingJob;
}

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

const StatusIcon: React.FC<{ status: ScrapingStatus }> = ({ status }) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'in_progress':
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
  }
};

const ScrapingStatusPage: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyWithStatus[]>([]);
  const [filter, setFilter] = useState<ScrapingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [isStartingBatch, setIsStartingBatch] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('companies')
        .select(`
          *,
          scraping_jobs (
            id,
            status,
            started_at,
            completed_at,
            presentations_found,
            next_scheduled,
            error
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const processedCompanies = data.map(company => ({
        ...company,
        latest_job: company.scraping_jobs[0] || undefined
      }));

      setCompanies(processedCompanies);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startBatchScraping = async () => {
    try {
      setIsStartingBatch(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/batch-scrape`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start batch scraping: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to start batch scraping');
      }

      // Refresh the companies list to show updated status
      await fetchCompanies();
    } catch (err) {
      console.error('Batch scraping error:', err);
      setError(err.message || 'Failed to start batch scraping. Please try again.');
    } finally {
      setIsStartingBatch(false);
    }
  };

  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedCompanies = (companies: CompanyWithStatus[]) => {
    return [...companies].sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      
      switch (sort.field) {
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        case 'symbol':
          return a.symbol.localeCompare(b.symbol) * direction;
        case 'status':
          return ((a.latest_job?.status || '') > (b.latest_job?.status || '') ? 1 : -1) * direction;
        case 'started_at':
          return ((a.latest_job?.started_at || '') > (b.latest_job?.started_at || '') ? 1 : -1) * direction;
        case 'completed_at':
          return ((a.latest_job?.completed_at || '') > (b.latest_job?.completed_at || '') ? 1 : -1) * direction;
        case 'presentations_found':
          return ((a.latest_job?.presentations_found || 0) - (b.latest_job?.presentations_found || 0)) * direction;
        case 'next_scheduled':
          return ((a.latest_job?.next_scheduled || '') > (b.latest_job?.next_scheduled || '') ? 1 : -1) * direction;
        default:
          return 0;
      }
    });
  };

  const filteredCompanies = companies.filter(company => {
    const matchesFilter = filter === 'all' || company.latest_job?.status === filter;
    const matchesSearch = 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedCompanies = getSortedCompanies(filteredCompanies);

  const stats = {
    total: companies.length,
    success: companies.filter(c => c.latest_job?.status === 'success').length,
    failed: companies.filter(c => c.latest_job?.status === 'failed').length,
    pending: companies.filter(c => c.latest_job?.status === 'pending').length,
    in_progress: companies.filter(c => c.latest_job?.status === 'in_progress').length,
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) {
      return <ChevronUp className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100" />;
    }
    return sort.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-slate-700" />
      : <ChevronDown className="h-4 w-4 text-slate-700" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading scraping status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 fade-in">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Scraping Status</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Monitor the scraping status of investor relations websites for Russell 2000 companies
                </p>
              </div>
              <button
                onClick={startBatchScraping}
                disabled={isStartingBatch}
                className={`btn btn-primary py-2 px-4 ${isStartingBatch ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isStartingBatch ? 'Starting...' : 'Start Batch Scraping'}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-6 border-b border-slate-200">
            <button 
              onClick={() => setFilter('all')}
              className={`bg-slate-50 rounded-lg p-4 transition-colors ${filter === 'all' ? 'ring-2 ring-primary-500' : 'hover:bg-slate-100'}`}
            >
              <div className="text-sm font-medium text-slate-600">Total Companies</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{stats.total}</div>
            </button>
            <button 
              onClick={() => setFilter('success')}
              className={`bg-green-50 rounded-lg p-4 transition-colors ${filter === 'success' ? 'ring-2 ring-green-500' : 'hover:bg-green-100'}`}
            >
              <div className="text-sm font-medium text-green-600">Successfully Scraped</div>
              <div className="mt-1 text-2xl font-semibold text-green-700">{stats.success}</div>
            </button>
            <button 
              onClick={() => setFilter('failed')}
              className={`bg-red-50 rounded-lg p-4 transition-colors ${filter === 'failed' ? 'ring-2 ring-red-500' : 'hover:bg-red-100'}`}
            >
              <div className="text-sm font-medium text-red-600">Failed</div>
              <div className="mt-1 text-2xl font-semibold text-red-700">{stats.failed}</div>
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`bg-yellow-50 rounded-lg p-4 transition-colors ${filter === 'pending' ? 'ring-2 ring-yellow-500' : 'hover:bg-yellow-100'}`}
            >
              <div className="text-sm font-medium text-yellow-600">Pending</div>
              <div className="mt-1 text-2xl font-semibold text-yellow-700">{stats.pending}</div>
            </button>
            <button 
              onClick={() => setFilter('in_progress')}
              className={`bg-blue-50 rounded-lg p-4 transition-colors ${filter === 'in_progress' ? 'ring-2 ring-blue-500' : 'hover:bg-blue-100'}`}
            >
              <div className="text-sm font-medium text-blue-600">In Progress</div>
              <div className="mt-1 text-2xl font-semibold text-blue-700">{stats.in_progress}</div>
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-slate-200 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="search"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ScrapingStatus | 'all')}
              className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Company
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('started_at')}
                  >
                    <div className="flex items-center">
                      Last Scraped
                      <SortIcon field="started_at" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('presentations_found')}
                  >
                    <div className="flex items-center">
                      Presentations
                      <SortIcon field="presentations_found" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('next_scheduled')}
                  >
                    <div className="flex items-center">
                      Next Scheduled
                      <SortIcon field="next_scheduled" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-slate-800">{company.symbol.substring(0, 2)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{company.name}</div>
                          <div className="text-sm text-slate-500">{company.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon status={company.latest_job?.status || 'pending'} />
                        <span className="ml-2 text-sm text-slate-900">
                          {company.latest_job?.status || 'Not Started'}
                        </span>
                      </div>
                      {company.latest_job?.error && (
                        <div className="mt-1 text-xs text-red-500">{company.latest_job.error}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {company.latest_job?.completed_at 
                        ? new Date(company.latest_job.completed_at).toLocaleDateString() 
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {company.latest_job?.presentations_found || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {company.latest_job?.next_scheduled
                        ? new Date(company.latest_job.next_scheduled).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center space-x-3">
                        <a
                          href={company.ir_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapingStatusPage;