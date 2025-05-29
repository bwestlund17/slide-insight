import React from 'react';
import { Link } from 'react-router-dom';
import { Presentation } from '../types';
import { FileText, Calendar, Eye, Tag, Bookmark } from 'lucide-react';
import { format } from 'date-fns';

interface PresentationCardProps {
  presentation: Presentation;
  variant?: 'default' | 'compact' | 'featured';
}

const PresentationCard: React.FC<PresentationCardProps> = ({ 
  presentation, 
  variant = 'default' 
}) => {
  const {
    id,
    title,
    companyName,
    companySymbol,
    date,
    tags = [],
    industry,
    thumbnailUrl,
    viewCount = 0,
    slideCount = 0,
    isBookmarked
  } = presentation;

  const formattedDate = format(new Date(date), 'MMM d, yyyy');

  if (variant === 'featured') {
    return (
      <div className="card overflow-hidden h-full">
        <div className="relative">
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            {isBookmarked && (
              <div className="bg-white p-1 rounded-full shadow-sm">
                <Bookmark className="h-5 w-5 text-primary-500 fill-primary-500" />
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <Link 
            to={`/company/${companySymbol}`}
            className="text-xs font-medium text-accent-600 hover:text-accent-700 mb-1 inline-block"
          >
            {companyName}
          </Link>
          <Link to={`/presentation/${id}`} className="block group">
            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <div className="mt-3 flex flex-wrap gap-1">
            {(Array.isArray(tags) ? tags : []).slice(0, 3).map((tag, index) => (
              <Link 
                key={index} 
                to={`/search?tag=${encodeURIComponent(tag)}`}
                className="text-xs py-1 px-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700"
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{viewCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="card hover:bg-slate-50 transition-colors">
        <div className="p-3 flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded flex items-center justify-center">
            <FileText className="h-5 w-5 text-slate-500" />
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <Link 
              to={`/presentation/${id}`}
              className="block text-sm font-medium text-slate-900 truncate hover:text-primary-600"
            >
              {title}
            </Link>
            <Link 
              to={`/company/${companySymbol}`}
              className="text-xs text-slate-500 hover:text-accent-600"
            >
              {companyName}
            </Link>
          </div>
          <div className="ml-2 flex-shrink-0 flex items-center text-xs text-slate-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="card h-full flex flex-col">
      <div className="relative">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          {isBookmarked && (
            <div className="bg-white p-1 rounded-full shadow-sm">
              <Bookmark className="h-5 w-5 text-primary-500 fill-primary-500" />
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-auto">
          <Link 
            to={`/company/${companySymbol}`}
            className="text-xs font-medium text-accent-600 hover:text-accent-700 mb-1 inline-block"
          >
            {companyName}
          </Link>
          <Link to={`/presentation/${id}`} className="block group">
            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {(Array.isArray(tags) ? tags : []).slice(0, 2).map((tag, index) => (
            <Link 
              key={index} 
              to={`/search?tag=${encodeURIComponent(tag)}`}
              className="text-xs py-1 px-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 truncate max-w-[120px]"
            >
              {tag}
            </Link>
          ))}
          {Array.isArray(tags) && tags.length > 2 && (
            <span className="text-xs py-1 px-2 bg-slate-100 rounded-full text-slate-700">
              +{tags.length - 2}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            <span>{slideCount} slides</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationCard;