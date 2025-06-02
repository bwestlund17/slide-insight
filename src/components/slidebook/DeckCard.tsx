import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Calendar, 
  FileText, 
  MoreVertical, 
  Copy, 
  Edit, 
  Trash2, 
  Share2, 
  Download,
  Clock
} from 'lucide-react';

interface DeckCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  slideCount: number;
  lastEdited: string;
  views?: number;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

const DeckCard: React.FC<DeckCardProps> = ({
  id,
  title,
  thumbnailUrl,
  slideCount,
  lastEdited,
  views = 0,
  onDuplicate,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };
  
  const handleMenuItemClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
    setShowMenu(false);
  };
  
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`;
    }
    if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    }
    return 'Just now';
  };
  
  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/editor/${id}`} className="block">
        <div className="relative aspect-[16/9] bg-gray-100">
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md">
              Edit Presentation
            </span>
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
            <FileText className="h-3 w-3 inline mr-1" />
            {slideCount} slides
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <div className="relative ml-1 flex-shrink-0">
              <button
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                onClick={handleMenuToggle}
              >
                <MoreVertical size={16} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <Link 
                    to={`/editor/${id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={(e) => handleMenuItemClick(e, () => window.open(`/presentation/${id}`, '_blank'))}
                  >
                    <Eye size={14} className="mr-2" />
                    Present
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={(e) => onDuplicate && handleMenuItemClick(e, onDuplicate)}
                  >
                    <Copy size={14} className="mr-2" />
                    Duplicate
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={(e) => handleMenuItemClick(e, () => {})}
                  >
                    <Share2 size={14} className="mr-2" />
                    Share
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={(e) => handleMenuItemClick(e, () => {})}
                  >
                    <Download size={14} className="mr-2" />
                    Download
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    onClick={(e) => onDelete && handleMenuItemClick(e, onDelete)}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              <span>{getRelativeTime(lastEdited)}</span>
            </div>
            <div className="flex items-center">
              <Eye size={12} className="mr-1" />
              <span>{views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DeckCard;