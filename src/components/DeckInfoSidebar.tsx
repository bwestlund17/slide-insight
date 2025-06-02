import React from 'react';
import { MaDeck } from '../types';
import { Calendar, FileText, Download, Briefcase, DollarSign, Target, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface DeckInfoSidebarProps {
  deck: MaDeck;
  onDownload?: (format: string) => void;
}

const DeckInfoSidebar: React.FC<DeckInfoSidebarProps> = ({ deck, onDownload }) => {
  const handleDownload = () => {
    if (onDownload) {
      onDownload(deck.format[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden sticky top-24">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-medium text-slate-900">Deck Information</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-slate-900">Deal Date</h4>
              <p className="text-sm text-slate-600">
                {deck.dealDate ? format(new Date(deck.dealDate), 'MMMM d, yyyy') : 'Not specified'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Briefcase className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-slate-900">Deal Type</h4>
              <p className="text-sm text-slate-600">{deck.dealType || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-slate-900">Deal Value</h4>
              <p className="text-sm text-slate-600">{deck.dealValue || 'Not disclosed'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-slate-900">Format</h4>
              <p className="text-sm text-slate-600">
                {deck.format.join(', ')}
                <span className="ml-2 text-slate-400">({deck.fileSize})</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Download className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-slate-900">Downloads</h4>
              <p className="text-sm text-slate-600">{deck.downloadCount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Tag className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-slate-900">Tags</h4>
              <div className="mt-1 flex flex-wrap gap-1">
                {deck.tags.map((tag, index) => (
                  <Link 
                    key={index}
                    to={`/ma-decks?tag=${encodeURIComponent(tag)}`}
                    className="text-xs py-1 px-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-200">
          <button 
            onClick={handleDownload}
            className="w-full btn btn-primary py-3 flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Full Deck
          </button>
          <p className="mt-2 text-xs text-center text-slate-500">
            {deck.isPremium ? 'Premium content - subscription required' : 'Free to download'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeckInfoSidebar;