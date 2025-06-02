import React, { useState } from 'react';
import SlideThumbnail from './SlideThumbnail';
import { Plus, ChevronLeft, Layout, ChevronRight, Search } from 'lucide-react';

interface Slide {
  id: string;
  title?: string;
  thumbnailUrl?: string;
}

interface SlidesSidebarProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SlidesSidebar: React.FC<SlidesSidebarProps> = ({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSlides = searchTerm
    ? slides.filter(slide => 
        (slide.title || '').toLowerCase().includes(searchTerm.toLowerCase()))
    : slides;
  
  if (isCollapsed) {
    return (
      <div className="w-10 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-2 border-b border-gray-200 flex justify-center">
          <button
            className="p-1 rounded text-gray-500 hover:bg-gray-100"
            onClick={onToggleCollapse}
            title="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-1">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={`h-6 w-6 mx-auto mb-1 rounded ${
                index === currentSlideIndex 
                  ? 'bg-blue-500' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => onSelectSlide(index)}
              title={`Slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="p-2 border-t border-gray-200 flex justify-center">
          <button
            className="p-1 rounded text-blue-600 hover:bg-blue-50"
            onClick={onAddSlide}
            title="Add slide"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Layout size={16} className="mr-1.5" />
          Slides
        </h3>
        <button
          className="p-1 rounded text-gray-500 hover:bg-gray-100"
          onClick={onToggleCollapse}
          title="Collapse sidebar"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
      
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="search"
            placeholder="Search slides..."
            className="w-full pl-8 pr-2 py-1.5 text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {filteredSlides.map((slide, index) => (
          <SlideThumbnail
            key={slide.id}
            id={slide.id}
            index={index}
            title={slide.title}
            thumbnailUrl={slide.thumbnailUrl}
            isSelected={index === currentSlideIndex}
            onSelect={() => onSelectSlide(index)}
            onDelete={() => onDeleteSlide(index)}
            onDuplicate={() => onDuplicateSlide(index)}
          />
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-200 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {slides.length} {slides.length === 1 ? 'slide' : 'slides'}
        </span>
        <button
          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm flex items-center hover:bg-blue-200 transition-colors"
          onClick={onAddSlide}
        >
          <Plus size={16} className="mr-1" />
          Add Slide
        </button>
      </div>
    </div>
  );
};

export default SlidesSidebar;