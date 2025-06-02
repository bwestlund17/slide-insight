import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MaDeck } from '../types';
import MaDeckViewer from '../components/MaDeckViewer';
import DeckInfoSidebar from '../components/DeckInfoSidebar';
import RelatedDecks from '../components/RelatedDecks';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useMaDeckById, useRelatedDecks, useRecordDeckDownload, useToggleFavorite } from '../hooks/useMaDecks';

const MaDeckViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use React Query hooks
  const { 
    data: deck,
    isLoading: deckLoading,
    error: deckError
  } = useMaDeckById(id || '');
  
  const {
    data: relatedDecks,
    isLoading: relatedLoading
  } = useRelatedDecks(id || '');
  
  const { mutate: recordDownload } = useRecordDeckDownload();
  const { mutate: toggleFavorite } = useToggleFavorite();

  useEffect(() => {
    // Increment view count when the page loads
    if (id) {
      // This could be implemented with a separate function
      console.log('Viewing deck', id);
    }
  }, [id]);

  const handleDownload = (deckId: string, format: string) => {
    recordDownload({ deckId, fileFormat: format });
  };

  const handleToggleFavorite = (deckId: string) => {
    toggleFavorite(deckId);
  };

  if (deckLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-slate-200 h-96 rounded-lg mb-4"></div>
              <div className="h-12 bg-slate-200 rounded-lg"></div>
            </div>
            <div>
              <div className="bg-slate-200 h-80 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (deckError || !deck) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-lg border border-slate-200 p-8 max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Deck Not Found</h2>
          <p className="text-slate-600 mb-6">
            {deckError instanceof Error ? deckError.message : 'The requested deck could not be found.'}
          </p>
          <Link 
            to="/ma-decks" 
            className="btn btn-primary py-2 px-4 inline-flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to M&A Decks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link 
          to="/ma-decks"
          className="inline-flex items-center text-sm text-slate-600 hover:text-primary-600"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to M&A Decks
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Deck Viewer */}
        <div className="lg:col-span-2">
          <MaDeckViewer 
            deck={deck}
            onDownload={(format) => handleDownload(deck.id, format)}
            onToggleFavorite={() => handleToggleFavorite(deck.id)}
          />
        </div>
        
        {/* Sidebar - Deck Info */}
        <div className="space-y-6">
          <DeckInfoSidebar 
            deck={deck} 
            onDownload={(format) => handleDownload(deck.id, format)}
          />
          
          {/* Related Decks */}
          {!relatedLoading && relatedDecks && relatedDecks.length > 0 && (
            <RelatedDecks 
              currentDeckId={deck.id} 
              relatedDecks={relatedDecks} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MaDeckViewerPage;