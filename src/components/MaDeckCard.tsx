import React from 'react';
import { Link } from 'react-router-dom';
import { MaDeck } from '../types';
import { FileText, Calendar, Eye, Download, Star, Bookmark, Lock } from 'lucide-react';
import { format } from 'date-fns';

interface MaDeckCardProps {
  deck: MaDeck;
  variant?: 'default' | 'compact' | 'featured';
}

const MaDeckCard: React.FC<MaDeckCardProps> = ({ 
  deck, 
  variant = 'default' 
}) => {
  const {
    id,
    title,
    description,
    thumbnailUrl,
    slideCount,
    rating,
    ratingCount,
    downloadCount,
    tags = [],
    category,
    createdAt,
    isPremium,
    isFavorite,
    company
  } = deck;

  const formattedDate = format(new Date(createdAt), 'MMM d, yyyy');

  if (variant === 'featured') {
    return (
      <div className="card overflow-hidden h-full shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="relative">
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            {isPremium && (
              <div className="bg-accent-100 p-1 rounded-full shadow-sm">
                <Lock className="h-4 w-4 text-accent-700" />
              </div>
            )}
            {isFavorite && (
              <div className="bg-white p-1 rounded-full shadow-sm">
                <Bookmark className="h-4 w-4 text-primary-500 fill-primary-500" />
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          {company && (
            <Link 
              to={`/search?company=${encodeURIComponent(company.name)}`}
              className="text-xs font-medium text-accent-600 hover:text-accent-700 mb-1 inline-block"
            >
              {company.name}
            </Link>
          )}
          <Link to={`/ma-decks/${id}`} className="block group">
            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">{description}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
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
              <div className="flex items-center mr-3">
                <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                <span>{rating.toFixed(1)}</span>
              </div>
              <FileText className="h-3 w-3 mr-1" />
              <span>{slideCount} slides</span>
            </div>
            <div className="flex items-center">
              <Download className="h-3 w-3 mr-1" />
              <span>{downloadCount.toLocaleString()}</span>
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
          <div className="flex-shrink-0 h-14 w-14 bg-slate-100 rounded overflow-hidden">
            <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover" />
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <Link 
              to={`/ma-decks/${id}`}
              className="block text-sm font-medium text-slate-900 truncate hover:text-primary-600"
            >
              {title}
            </Link>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-xs text-yellow-500">
                <Star className="h-3 w-3 fill-yellow-500 mr-1" />
                <span>{rating.toFixed(1)}</span>
              </div>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-xs text-slate-500">{slideCount} slides</span>
              {isPremium && (
                <>
                  <span className="mx-2 text-slate-300">•</span>
                  <Lock className="h-3 w-3 text-accent-600" />
                </>
              )}
            </div>
          </div>
          <div className="ml-2 flex-shrink-0 flex items-center text-xs text-slate-500">
            <Download className="h-3 w-3 mr-1" />
            <span>{downloadCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="card h-full flex flex-col shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          {isPremium && (
            <div className="bg-accent-100 p-1 rounded-full shadow-sm">
              <Lock className="h-4 w-4 text-accent-700" />
            </div>
          )}
          {isFavorite && (
            <div className="bg-white p-1 rounded-full shadow-sm">
              <Bookmark className="h-4 w-4 text-primary-500 fill-primary-500" />
            </div>
          )}
        </div>
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-slate-700">
          {category}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-auto">
          {company && (
            <Link 
              to={`/search?company=${encodeURIComponent(company.name)}`}
              className="text-xs font-medium text-accent-600 hover:text-accent-700 mb-1 inline-block"
            >
              {company.name}
            </Link>
          )}
          <Link to={`/ma-decks/${id}`} className="block group">
            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag, index) => (
            <Link 
              key={index} 
              to={`/search?tag=${encodeURIComponent(tag)}`}
              className="text-xs py-1 px-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 truncate max-w-[120px]"
            >
              {tag}
            </Link>
          ))}
          {tags.length > 2 && (
            <span className="text-xs py-1 px-2 bg-slate-100 rounded-full text-slate-700">
              +{tags.length - 2}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
              <span>{rating.toFixed(1)} ({ratingCount})</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              <span>{slideCount} slides</span>
            </div>
          </div>
          <div className="flex items-center">
            <Download className="h-3 w-3 mr-1" />
            <span>{downloadCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaDeckCard;