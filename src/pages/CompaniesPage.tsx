import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Company {
  id: string;
  name: string;
  symbol: string;
  website: string;
  ir_url: string;
  industry: string;
  sector: string;
  market_cap: number;
}

type SortField = 'name' | 'symbol' | 'industry' | 'sector' | 'market_cap';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    website: '',
    ir_url: '',
    industry: '',
    sector: '',
    market_cap: ''
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user?.app_metadata?.role !== 'admin') {
      navigate('/admin');
      return;
    }
    fetchCompanies();
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      setError('Failed to fetch companies');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user?.app_metadata?.role !== 'admin') {
        throw new Error('Unauthorized - Admin access required');
      }

      const { data, error } = await supabase
        .from('companies')
        .insert([{
          ...formData,
          market_cap: parseFloat(formData.market_cap)
        }])
        .select();

      if (error) throw error;

      setCompanies([...(data || []), ...companies]);
      setShowAddModal(false);
      setFormData({
        name: '',
        symbol: '',
        website: '',
        ir_url: '',
        industry: '',
        sector: '',
        market_cap: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to add company');
      console.error('Error:', err);
      if (err.message.includes('Unauthorized')) {
        navigate('/admin');
      }
    }
  };

  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedCompanies = (companies: Company[]) => {
    return [...companies].sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      
      switch (sort.field) {
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        case 'symbol':
          return a.symbol.localeCompare(b.symbol) * direction;
        case 'industry':
          return a.industry.localeCompare(b.industry) * direction;
        case 'sector':
          return a.sector.localeCompare(b.sector) * direction;
        case 'market_cap':
          return ((a.market_cap || 0) - (b.market_cap || 0)) * direction;
        default:
          return 0;
      }
    });
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCompanies = getSortedCompanies(filteredCompanies);

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
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Companies</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage Russell 2000 companies and their information
              </p>
            </div>
            <button 
              className="btn btn-primary py-2 px-4 flex items-center"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Company
            </button>
          </div>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

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
                  onClick={() => handleSort('industry')}
                >
                  <div className="flex items-center">
                    Industry
                    <SortIcon field="industry" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer group"
                  onClick={() => handleSort('sector')}
                >
                  <div className="flex items-center">
                    Sector
                    <SortIcon field="sector" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer group"
                  onClick={() => handleSort('market_cap')}
                >
                  <div className="flex items-center">
                    Market Cap
                    <SortIcon field="market_cap" />
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
                    <span className="text-sm text-slate-900">{company.industry}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-900">{company.sector}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-900">
                      ${(company.market_cap / 1000000000).toFixed(1)}B
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center space-x-3">
                      <button className="text-slate-400 hover:text-slate-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-slate-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-slate-900">Add Company</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCompany} className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Symbol</label>
                  <input
                    type="text"
                    required
                    value={formData.symbol}
                    onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Website</label>
                  <input
                    type="url"
                    required
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">IR Website</label>
                  <input
                    type="url"
                    required
                    value={formData.ir_url}
                    onChange={(e) => setFormData({...formData, ir_url: e.target.value})}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Industry</label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Sector</label>
                  <input
                    type="text"
                    required
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Market Cap ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.market_cap}
                    onChange={(e) => setFormData({...formData, market_cap: e.target.value})}
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary py-2 px-4"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CompaniesPage;