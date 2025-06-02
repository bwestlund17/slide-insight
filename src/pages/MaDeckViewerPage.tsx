import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MaDeck } from '../types';
import MaDeckViewer from '../components/MaDeckViewer';
import DeckInfoSidebar from '../components/DeckInfoSidebar';
import RelatedDecks from '../components/RelatedDecks';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { generateMockDecks } from '../utils/mockData';

// Import the mock data generation function
export const generateMockDecks = (count: number): MaDeck[] => {
  // This is just a placeholder - the real implementation is in the MaDecksPage
  // Creating this to avoid circular dependencies
  return [];
};

const MaDeckViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<MaDeck | null>(null);
  const [relatedDecks, setRelatedDecks] = useState<MaDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch deck details
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Get all decks (in a real app, you would fetch just one by ID)
        const allDecks = generateMockDecks(24);
        const foundDeck = allDecks.find(d => d.id === id);
        
        if (foundDeck) {
          setDeck(foundDeck);
          
          // Get related decks (same category or tags)
          const related = allDecks
            .filter(d => d.id !== id && (
              d.category === foundDeck.category ||
              d.tags.some(tag => foundDeck.tags.includes(tag))
            ))
            .slice(0, 5);
          
          setRelatedDecks(related);
        } else {
          setError('Deck not found');
        }
      } catch (err) {
        setError('Failed to load deck');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, [id]);

  if (loading) {
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

  if (error || !deck) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-lg border border-slate-200 p-8 max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Deck Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'The requested deck could not be found.'}</p>
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
          <MaDeckViewer deck={deck} />
        </div>
        
        {/* Sidebar - Deck Info */}
        <div className="space-y-6">
          <DeckInfoSidebar deck={deck} />
          
          {/* Related Decks */}
          {relatedDecks.length > 0 && (
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