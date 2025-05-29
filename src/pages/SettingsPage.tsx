import React from 'react';
import { Save } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Configure scraping and application settings
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            {/* Scraping Settings */}
            <div>
              <h3 className="text-lg font-medium text-slate-900">Scraping Settings</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Scraping Frequency
                  </label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                    <option>Every 6 hours</option>
                    <option>Every 12 hours</option>
                    <option>Every 24 hours</option>
                    <option>Every week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Concurrent Scraping Limit
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    defaultValue={5}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="auto-retry"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="auto-retry" className="ml-2 block text-sm text-slate-700">
                    Automatically retry failed scraping jobs
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="pt-6">
              <h3 className="text-lg font-medium text-slate-900">Notification Settings</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm text-slate-700">
                    Receive email notifications for failed scraping jobs
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="slack-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                  />
                  <label htmlFor="slack-notifications" className="ml-2 block text-sm text-slate-700">
                    Send notifications to Slack
                  </label>
                </div>
              </div>
            </div>

            {/* API Settings */}
            <div className="pt-6">
              <h3 className="text-lg font-medium text-slate-900">API Settings</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    API Rate Limit (requests per minute)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    defaultValue={60}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    API Token
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    defaultValue="sk_test_123456789"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary py-2 px-4 flex items-center"
              >
                <Save className="h-4 w-4 mr-1.5" />
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;