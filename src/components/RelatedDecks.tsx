import React from 'react';
import { MaDeck } from '../types';
import MaDeckCard from './MaDeckCard';

interface RelatedDecksProps {
  currentDeckId: string;
  relatedDecks: MaDeck[];
  title?: string;
}

const RelatedDecks: React.FC<RelatedDecksProps> = ({ 
  currentDeckId, 
  relatedDecks, 
  title = "Related Decks" 
}) => {
  // Filter out the current deck if it's in the related decks list
  const filteredDecks = relatedDecks.filter(deck => deck.id !== currentDeckId);
  
  if (filteredDecks.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {filteredDecks.slice(0, 3).map(deck => (
            <MaDeckCard key={deck.id} deck={deck} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedDecks;