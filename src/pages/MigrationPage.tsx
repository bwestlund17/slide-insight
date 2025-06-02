import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Download, FileText, RefreshCw, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MigrationStats {
  total: number;
  success: number;
  skipped: number;
  failed: number;
  failedItems?: Array<{ id: string; title: string; error: string }>;
}

const MigrationPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; stats?: MigrationStats; error?: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const runMigration = async () => {
    try {
      setIsRunning(true);
      setResult(null);
      setProgress(10);
      
      // Get the service role key - in a real app, this would be secured properly
      // and this operation would be performed by an admin
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to run migrations');
      }

      setProgress(30);
      
      // Call the Edge Function to run migration
      const response = await fetch(
        `${supabaseUrl}/functions/v1/migrate-presentations`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setProgress(90);
      
      if (!response.ok) {
        throw new Error(`Migration failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsRunning(false);
      setProgress(100);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">Presentation Storage Migration</h1>
            <p className="mt-2 text-slate-600">
              This tool migrates presentation files from their current URLs to Supabase storage.
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Migration Process</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Fetch all presentations from the database</li>
                        <li>Download each presentation file from its current URL</li>
                        <li>Upload the file to Supabase storage</li>
                        <li>Update the presentation record with the new storage path</li>
                        <li>Skip presentations that already have a storage path</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  className={`btn ${isRunning ? 'btn-outline' : 'btn-primary'} py-2 px-4 flex items-center`}
                  onClick={runMigration}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Migration in progress...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      Start Migration
                    </>
                  )}
                </button>
              </div>
              
              {isRunning && (
                <div className="mt-4">
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 text-center">
                    <Clock className="inline-block h-4 w-4 mr-1 text-slate-400" />
                    This may take several minutes depending on the number of presentations
                  </p>
                </div>
              )}
              
              {result && (
                <div className={`mt-6 border rounded-md p-4 ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-sm font-medium ${
                        result.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.success ? 'Migration Completed' : 'Migration Failed'}
                      </h3>
                      {result.message && (
                        <p className="mt-1 text-sm text-slate-700">{result.message}</p>
                      )}
                      {result.error && (
                        <p className="mt-1 text-sm text-red-700">{result.error}</p>
                      )}
                      
                      {result.stats && (
                        <div className="mt-3 text-sm">
                          <h4 className="font-medium text-slate-800 mb-2">Migration Statistics</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                            <div className="bg-white p-3 rounded border border-slate-200 text-center">
                              <p className="text-xs text-slate-500">Total</p>
                              <p className="text-lg font-semibold">{result.stats.total}</p>
                            </div>
                            <div className="bg-white p-3 rounded border border-green-200 text-center">
                              <p className="text-xs text-green-600">Successful</p>
                              <p className="text-lg font-semibold text-green-700">{result.stats.success}</p>
                            </div>
                            <div className="bg-white p-3 rounded border border-blue-200 text-center">
                              <p className="text-xs text-blue-600">Skipped</p>
                              <p className="text-lg font-semibold text-blue-700">{result.stats.skipped}</p>
                            </div>
                            <div className="bg-white p-3 rounded border border-red-200 text-center">
                              <p className="text-xs text-red-600">Failed</p>
                              <p className="text-lg font-semibold text-red-700">{result.stats.failed}</p>
                            </div>
                          </div>
                          
                          {result.stats.failedItems && result.stats.failedItems.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium text-slate-800 mb-2">Failed Items</h4>
                              <div className="max-h-60 overflow-y-auto border border-slate-200 rounded">
                                <table className="min-w-full divide-y divide-slate-200">
                                  <thead className="bg-slate-50">
                                    <tr>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Error</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-slate-200">
                                    {result.stats.failedItems.map(item => (
                                      <tr key={item.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs">{item.id}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs">{item.title}</td>
                                        <td className="px-4 py-2 text-xs text-red-600">{item.error}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationPage;