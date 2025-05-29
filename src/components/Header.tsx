import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, FileText, BarChart2, Building2, Bell } from 'lucide-react';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="SlideInsight home">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-slate-900">SlideInsight</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                location.pathname === '/explore' ? 'text-primary-600' : 'text-slate-700'
              }`}
            >
              Explore
            </Link>
            <div className="relative">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search presentations..."
                    className="w-64 h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>
            <button 
              className="btn btn-primary px-4 py-2"
              onClick={() => alert('Sign up feature not implemented in demo')}
            >
              Sign Up
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-slate-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 slide-up">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search presentations..."
                  className="w-full pl-10 pr-4 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/explore" 
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="mr-3 h-5 w-5 text-slate-500" />
                Explore Presentations
              </Link>
              <Link 
                to="/explore?filter=industries" 
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 className="mr-3 h-5 w-5 text-slate-500" />
                Browse Industries
              </Link>
              <Link 
                to="/explore?filter=trending" 
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart2 className="mr-3 h-5 w-5 text-slate-500" />
                Trending Presentations
              </Link>
              <Link 
                to="/explore" 
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell className="mr-3 h-5 w-5 text-slate-500" />
                Create Alert
              </Link>
            </nav>
            <div className="pt-4 border-t border-slate-200">
              <button 
                className="w-full btn btn-primary px-4 py-2"
                onClick={() => {
                  alert('Sign up feature not implemented in demo');
                  setMobileMenuOpen(false);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;