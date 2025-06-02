import React from 'react';
import { MaDeck } from '../types';
import MaDeckCard from './MaDeckCard';

interface MaDeckGridProps {
  decks: MaDeck[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'featured';
}

const MaDeckGrid: React.FC<MaDeckGridProps> = ({ 
  decks, 
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

  if (!decks.length) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">No decks found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridClass()} gap-4 md:gap-6`}>
      {decks.map((deck) => (
        <div key={deck.id} className="fade-in">
          <MaDeckCard 
            deck={deck} 
            variant={variant}
          />
        </div>
      ))}
    </div>
  );
};

export default MaDeckGrid;