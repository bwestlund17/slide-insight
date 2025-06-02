import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, FileText, BarChart2, Building2, Bell, Shuffle, Bookmark, User, LogIn } from 'lucide-react';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = false; // Replace with actual auth state

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

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
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
            <Link 
              to="/presentations" 
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                location.pathname === '/presentations' ? 'text-primary-600' : 'text-slate-700'
              }`}
            >
              Presentations
            </Link>
            <Link 
              to="/ma-decks" 
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                location.pathname === '/ma-decks' || location.pathname.startsWith('/ma-decks/') ? 'text-primary-600' : 'text-slate-700'
              }`}
            >
              M&A Decks
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
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <User className="h-5 w-5 text-slate-700" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <Link to="/account" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Your Account</Link>
                    <Link to="/favorites" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Favorites</Link>
                    <Link to="/downloads" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Downloads</Link>
                    <div className="border-t border-slate-200 my-1"></div>
                    <button className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors"
                  onClick={() => alert('Sign in feature not implemented in demo')}
                >
                  Sign In
                </button>
                <button 
                  className="btn btn-primary px-4 py-2"
                  onClick={() => alert('Sign up feature not implemented in demo')}
                >
                  Sign Up
                </button>
              </div>
            )}
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
                to="/ma-decks" 
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shuffle className="mr-3 h-5 w-5 text-slate-500" />
                M&A Decks
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
              {isLoggedIn && (
                <Link 
                  to="/favorites" 
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bookmark className="mr-3 h-5 w-5 text-slate-500" />
                  Saved Decks
                </Link>
              )}
            </nav>
            <div className="pt-4 border-t border-slate-200">
              {isLoggedIn ? (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/account"
                    className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="mr-3 h-5 w-5 text-slate-500" />
                    Your Account
                  </Link>
                  <button 
                    className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-slate-100 w-full text-left"
                  >
                    <LogIn className="mr-3 h-5 w-5 text-slate-500" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  className="w-full btn btn-primary px-4 py-2"
                  onClick={() => {
                    alert('Sign up feature not implemented in demo');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up / Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;