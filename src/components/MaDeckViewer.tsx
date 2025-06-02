import React, { useState } from 'react';
import { MaDeck } from '../types';
import { ChevronLeft, ChevronRight, Download, Maximize, Minimize, Share2, Bookmark, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { motion } from 'framer-motion';

interface MaDeckViewerProps {
  deck: MaDeck;
  onDownload?: (format: string) => void;
  onToggleFavorite?: () => void;
}

const MaDeckViewer: React.FC<MaDeckViewerProps> = ({ 
  deck, 
  onDownload, 
  onToggleFavorite 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(deck.isFavorite);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < deck.slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const handleRate = (rating: number) => {
    setUserRating(rating);
    // In a real app, we would send this to the server
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextSlide(),
    onSwipedRight: () => handlePrevSlide(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: deck.title,
        text: `Check out this M&A deck: ${deck.title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(deck.format[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden">
      {/* Viewer Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{deck.title}</h2>
          <p className="text-sm text-slate-500">{deck.slideCount} slides • {deck.company?.name || 'Unknown Company'}</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`p-2 rounded-full ${isBookmarked ? 'bg-primary-50 text-primary-600' : 'hover:bg-slate-100'}`}
            onClick={toggleBookmark}
            title="Bookmark"
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary-500' : ''}`} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-slate-100"
            onClick={handleShare}
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-slate-100"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Slide Viewer */}
      <div 
        className="relative bg-slate-800 aspect-[16/9]"
        {...swipeHandlers}
      >
        <motion.img 
          key={currentSlide}
          src={deck.slides[currentSlide]?.imageUrl} 
          alt={`Slide ${currentSlide + 1}`} 
          className="w-full h-full object-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Navigation Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button 
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
            className="p-2 rounded-full bg-black bg-opacity-50 text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={handleNextSlide}
            disabled={currentSlide === deck.slides.length - 1}
            className="p-2 rounded-full bg-black bg-opacity-50 text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        {/* Slide Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentSlide + 1} / {deck.slides.length}
        </div>
      </div>

      {/* Slide Thumbnails */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex overflow-x-auto pb-2 space-x-2">
          {deck.slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden ${
                currentSlide === index ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={slide.imageUrl} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="border-t border-slate-200 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">{deck.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-500">({deck.ratingCount})</span>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-full text-sm ${userRating === 1 ? 'bg-green-100 text-green-700' : 'bg-slate-100 hover:bg-slate-200'}`}
            onClick={() => handleRate(1)}
          >
            <ThumbsUp className="h-4 w-4 inline-block mr-1" />
            Helpful
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm ${userRating === 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 hover:bg-slate-200'}`}
            onClick={() => handleRate(0)}
          >
            <ThumbsDown className="h-4 w-4 inline-block mr-1" />
            Not helpful
          </button>
          <button 
            className="px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700 hover:bg-primary-200"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 inline-block mr-1" />
            Download
          </button>
        </div>
      </div>
      
      {/* Comments/Feedback Toggle */}
      <div className="border-t border-slate-200 p-4">
        <button 
          className="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
        
        {showComments && (
          <div className="mt-4 space-y-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium text-sm">JD</span>
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">John Doe</span>
                  <span className="text-xs text-slate-500">2 days ago</span>
                </div>
                <p className="text-sm text-slate-700 mt-1">
                  Great deck! I especially like the synergy analysis on slide 5.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center">
                <span className="text-secondary-700 font-medium text-sm">AL</span>
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">Alex Lee</span>
                  <span className="text-xs text-slate-500">1 week ago</span>
                </div>
                <p className="text-sm text-slate-700 mt-1">
                  This saved me so much time preparing for our upcoming deal. Thank you!
                </p>
              </div>
            </div>
            
            {/* Comment Input */}
            <div className="mt-4">
              <textarea 
                placeholder="Add your comment..."
                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button className="btn btn-primary px-4 py-2 text-sm">
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaDeckViewer;