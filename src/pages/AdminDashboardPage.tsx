import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Users, FileText, Settings, LogOut } from 'lucide-react';
import ScrapingStatusPage from './ScrapingStatusPage';
import CompaniesPage from './CompaniesPage';
import PresentationsPage from './PresentationsPage';
import SettingsPage from './SettingsPage';

type ActiveTab = 'scraping' | 'companies' | 'presentations' | 'settings';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scraping');

  const renderContent = () => {
    switch (activeTab) {
      case 'scraping':
        return <ScrapingStatusPage />;
      case 'companies':
        return <CompaniesPage />;
      case 'presentations':
        return <PresentationsPage />;
      case 'settings':
        return <SettingsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <Link 
              to="/"
              className="btn btn-outline py-1.5 px-3 flex items-center text-sm"
              onClick={() => {
                // In a real app, you would handle logout here
              }}
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('scraping')}
                  className={`flex items-center px-4 py-3 text-sm font-medium text-left ${
                    activeTab === 'scraping' 
                      ? 'text-primary-600 bg-primary-50 border-l-2 border-primary-600' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Database className="h-5 w-5 mr-3" />
                  Scraping Status
                </button>
                <button 
                  onClick={() => setActiveTab('companies')}
                  className={`flex items-center px-4 py-3 text-sm font-medium text-left ${
                    activeTab === 'companies' 
                      ? 'text-primary-600 bg-primary-50 border-l-2 border-primary-600' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  Companies
                </button>
                <button 
                  onClick={() => setActiveTab('presentations')}
                  className={`flex items-center px-4 py-3 text-sm font-medium text-left ${
                    activeTab === 'presentations' 
                      ? 'text-primary-600 bg-primary-50 border-l-2 border-primary-600' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Presentations
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center px-4 py-3 text-sm font-medium text-left ${
                    activeTab === 'settings' 
                      ? 'text-primary-600 bg-primary-50 border-l-2 border-primary-600' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;