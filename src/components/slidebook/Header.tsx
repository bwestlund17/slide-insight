import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  LogOut, 
  Layout, 
  Grid, 
  Settings, 
  FileText, 
  HelpCircle,
  Bell,
  ChevronDown
} from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mock login state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  // Mock user data
  const user = {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/300',
    plan: 'Pro'
  };
  
  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'mention',
      message: 'Alex Kim mentioned you in a comment',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 2,
      type: 'share',
      message: 'Sarah Johnson shared a presentation with you',
      time: 'Yesterday',
      isRead: false
    },
    {
      id: 3,
      type: 'system',
      message: 'Your account has been upgraded to Pro',
      time: '3 days ago',
      isRead: true
    }
  ];
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };
  
  // Handle menu toggles
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };
  
  const handleLogout = () => {
    // In a real app, this would call an auth service
    setIsLoggedIn(false);
    navigate('/auth/login');
  };
  
  // Check if the current path is for the Slidebook editor or presentation app
  const isSlideBookPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/editor') || 
                          location.pathname.startsWith('/templates') ||
                          location.pathname.startsWith('/account');
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled || isSlideBookPage ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="SlideBook home">
              <svg 
                viewBox="0 0 24 24" 
                className="h-8 w-8 text-blue-600" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-900">SlideBook</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/templates" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/templates' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Templates
            </Link>
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === '/explore' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Explore
            </Link>
            <div className="relative">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-64 h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 relative"
                  >
                    <Bell size={20} />
                    {notifications.some(n => !n.isRead) && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                  </button>
                  
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
                      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                        <button className="text-xs text-blue-600 hover:text-blue-500">
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {notifications.map((notification) => (
                              <div key={notification.id} className={`p-4 ${notification.isRead ? '' : 'bg-blue-50'}`}>
                                <div className="flex">
                                  <div className="flex-shrink-0">
                                    {notification.type === 'mention' && (
                                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-800">@</span>
                                      </div>
                                    )}
                                    {notification.type === 'share' && (
                                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-green-800" />
                                      </div>
                                    )}
                                    {notification.type === 'system' && (
                                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Settings className="h-4 w-4 text-purple-800" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm text-gray-900">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-200 text-center">
                        <a href="#" className="text-xs text-blue-600 hover:text-blue-500">
                          View all notifications
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 overflow-hidden">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="hidden lg:flex items-center">
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                    </div>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
                      <div className="p-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Layout className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/account"
                          className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Account Settings
                        </Link>
                        <Link
                          to="#"
                          className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Help & Support
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 p-2">
                        <button
                          className="w-full text-left block px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 flex items-center"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-3 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="text-gray-700 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 slide-up">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search presentations..."
                  className="w-full pl-10 pr-4 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/dashboard" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Layout className="mr-3 h-5 w-5 text-gray-500" />
                Dashboard
              </Link>
              <Link 
                to="/templates" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Grid className="mr-3 h-5 w-5 text-gray-500" />
                Templates
              </Link>
              <Link 
                to="/explore" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="mr-3 h-5 w-5 text-gray-500" />
                Explore
              </Link>
              <Link 
                to="/account" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="mr-3 h-5 w-5 text-gray-500" />
                Account Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-left w-full"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                Sign out
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;