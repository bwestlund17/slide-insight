import React from 'react';
import { Grip, Trash2, Copy } from 'lucide-react';

interface SlideThumbnailProps {
  id: string;
  index: number;
  title?: string;
  thumbnailUrl?: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  id,
  index,
  title,
  thumbnailUrl,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate
}) => {
  return (
    <div 
      className={`group relative flex p-2 border hover:border-blue-500 transition-colors cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white'
      } rounded-md mb-1`}
      onClick={onSelect}
    >
      <div className="flex-shrink-0 mr-1 text-gray-400 cursor-move">
        <Grip size={16} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="aspect-[16/9] bg-white border border-gray-200 rounded overflow-hidden">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-xs">
              Slide {index + 1}
            </div>
          )}
        </div>
        
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-gray-600 truncate">{title || `Slide ${index + 1}`}</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
            <button
              className="p-1 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              title="Duplicate slide"
            >
              <Copy size={14} />
            </button>
            <button
              className="p-1 text-gray-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete slide"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideThumbnail;