import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-36rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <FileQuestion className="mx-auto h-24 w-24 text-primary-500" />
          <h2 className="mt-6 text-3xl font-bold text-slate-900">Page Not Found</h2>
          <p className="mt-2 text-sm text-slate-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            to="/"
            className="w-full flex justify-center btn btn-primary py-2 px-4"
          >
            Go Home
          </Link>
          <Link
            to="/explore"
            className="w-full flex justify-center btn btn-outline py-2 px-4"
          >
            Explore Presentations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;