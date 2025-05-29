import React from 'react';
import { Presentation } from '../types';
import PresentationCard from './PresentationCard';

interface PresentationGridProps {
  presentations: Presentation[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'featured';
}

const PresentationGrid: React.FC<PresentationGridProps> = ({ 
  presentations, 
  columns = 3,
  variant = 'default'
}) => {
  const getGridClass = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (!presentations.length) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">No presentations found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridClass()} gap-4 md:gap-6`}>
      {presentations.map((presentation) => (
        <div key={presentation.id} className="fade-in">
          <PresentationCard 
            presentation={presentation} 
            variant={variant}
          />
        </div>
      ))}
    </div>
  );
};

export default PresentationGrid;