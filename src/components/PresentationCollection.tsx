import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Calendar, Star, Bookmark, ExternalLink, Plus } from 'lucide-react';

interface PresentationItem {
  id: string;
  title: string;
  companyName: string;
  thumbnailUrl: string;
  date: string;
  viewCount: number;
  slideCount: number;
  isBookmarked?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

interface PresentationCollectionProps {
  title: string;
  subtitle?: string;
  presentations: PresentationItem[];
  viewAllLink?: string;
}

const PresentationCollection: React.FC<PresentationCollectionProps> = ({
  title,
  subtitle,
  presentations,
  viewAllLink
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link to={viewAllLink} className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
            View all
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {presentations.map(presentation => (
          <PresentationCard key={presentation.id} presentation={presentation} />
        ))}
        
        <div className="bg-gray-50 rounded-lg border border-gray-200 border-dashed overflow-hidden flex items-center justify-center h-full">
          <div className="text-center p-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-3 text-sm font-medium text-gray-900">Browse More</h3>
            <p className="mt-1 text-xs text-gray-500">Discover similar presentations in our library</p>
            <div className="mt-3">
              <Link
                to={viewAllLink || "/presentations"}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PresentationCard: React.FC<{ presentation: PresentationItem }> = ({ presentation }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={`/sequoia/${presentation.id}`}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3]">
        <img 
          src={presentation.thumbnailUrl} 
          alt={presentation.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {presentation.isNew && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        )}
        {presentation.isFeatured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        )}
        {presentation.isBookmarked && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
            <Bookmark className="h-4 w-4 text-blue-600 fill-blue-600" />
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center justify-between text-white">
            <div className="text-xs font-medium">{presentation.slideCount} slides</div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {presentation.viewCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-300">
            <span className="bg-white text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium">
              View Presentation
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600">
          {presentation.title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-gray-500">{presentation.companyName}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(presentation.date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PresentationCollection;