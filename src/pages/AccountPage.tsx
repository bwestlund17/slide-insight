import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Key, CreditCard, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data
  const user = {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/300',
    plan: 'Pro',
    billing: {
      nextBillingDate: '2023-06-15',
      amount: '$12.99',
      card: '**** **** **** 4242',
      cardExpiry: '06/25'
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
            
            <div className="mb-6 flex items-center">
              <div className="mr-6">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
                />
              </div>
              <div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Change Photo
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={user.name}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input 
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={user.email}
                />
              </div>
              
              <div className="pt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'password':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="pt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'billing':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Billing Information</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Current Plan: {user.plan}</h4>
                  <p className="mt-1 text-sm text-blue-700">
                    Your next billing date is {user.billing.nextBillingDate} for {user.billing.amount}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Method</h4>
              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-gray-800">VISA</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.billing.card}</div>
                    <div className="text-xs text-gray-500">Expires {user.billing.cardExpiry}</div>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Edit
                </button>
              </div>
              <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                + Add new payment method
              </button>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Billing History</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        May 15, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        $12.99
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:text-blue-900">
                          Receipt
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        April 15, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        $12.99
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:text-blue-900">
                          Receipt
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Collaboration Invites</h4>
                  <p className="text-sm text-gray-500">Receive notifications when someone invites you to collaborate</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Marketing Emails</h4>
                  <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500 mb-4">
                Add an extra layer of security to your account by requiring a verification code in addition to your password.
              </p>
              <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Enable Two-Factor Authentication
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Login Sessions</h4>
              <p className="text-sm text-gray-500 mb-4">
                These are devices that have logged into your account. Revoke any sessions that you do not recognize.
              </p>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Chrome on Windows
                      </div>
                      <div className="text-xs text-gray-500">
                        Active now • San Francisco, USA
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Current
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Safari on iPhone
                      </div>
                      <div className="text-xs text-gray-500">
                        2 hours ago • San Francisco, USA
                      </div>
                    </div>
                    <button className="text-xs text-red-600 hover:text-red-800">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Account Activity</h4>
              <p className="text-sm text-gray-500 mb-4">
                Review your recent account activity.
              </p>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                View activity log
              </a>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Account Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your profile, billing and account preferences
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar navigation */}
          <aside className="w-full md:w-64">
            <nav className="bg-white shadow-sm rounded-lg overflow-hidden">
              <button
                className={`w-full px-4 py-3 flex items-center text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </button>
              
              <button
                className={`w-full px-4 py-3 flex items-center text-sm font-medium ${
                  activeTab === 'password'
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('password')}
              >
                <Key className="mr-3 h-5 w-5" />
                Password
              </button>
              
              <button
                className={`w-full px-4 py-3 flex items-center text-sm font-medium ${
                  activeTab === 'billing'
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('billing')}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Billing
              </button>
              
              <button
                className={`w-full px-4 py-3 flex items-center text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </button>
              
              <button
                className={`w-full px-4 py-3 flex items-center text-sm font-medium ${
                  activeTab === 'security'
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Shield className="mr-3 h-5 w-5" />
                Security
              </button>
              
              <a
                href="/auth/login"
                className="w-full px-4 py-3 flex items-center text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </a>
            </nav>
            
            <div className="mt-6 bg-white shadow-sm rounded-lg p-4">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Need help?</h4>
                  <p className="mt-1 text-xs text-gray-500">
                    Contact our support team for assistance with your account.
                  </p>
                  <a href="#" className="mt-2 inline-block text-xs font-medium text-blue-600 hover:text-blue-500">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main content */}
          <main className="flex-1 bg-white shadow-sm rounded-lg overflow-hidden p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;