import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Download, 
  Share2, 
  Bookmark, 
  ThumbsUp,
  ExternalLink,
  Clock,
  FileText,
  Calendar,
  Eye
} from 'lucide-react';

interface Slide {
  id: string;
  number: number;
  imageUrl: string;
  title?: string;
  description?: string;
}

interface Presentation {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  date: string;
  slideCount: number;
  slides: Slide[];
  downloadUrl?: string;
  tags?: string[];
  viewCount?: number;
}

interface SequoiaPresentationViewerProps {
  presentation: Presentation;
  onBookmark?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const SequoiaPresentationViewer: React.FC<SequoiaPresentationViewerProps> = ({
  presentation,
  onBookmark,
  onDownload,
  onShare
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Setup slide transition animation
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  const [slideDirection, setSlideDirection] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateToSlide(currentSlide - 1);
      } else if (e.key === 'ArrowRight') {
        navigateToSlide(currentSlide + 1);
      } else if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isFullscreen]);

  // Swipe handlers for touch devices
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigateToSlide(currentSlide + 1),
    onSwipedRight: () => navigateToSlide(currentSlide - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Navigation functions
  const navigateToSlide = (index: number) => {
    if (index < 0 || index >= presentation.slides.length) return;
    
    setSlideDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    
    // Scroll the thumbnail into view
    const thumbnail = document.getElementById(`thumbnail-${index}`);
    thumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const prevSlide = () => navigateToSlide(currentSlide - 1);
  const nextSlide = () => navigateToSlide(currentSlide + 1);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (slideContainerRef.current?.requestFullscreen) {
        slideContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Zoom functions
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setZoomLevel(1);

  // Bookmark toggle
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onBookmark) onBookmark();
  };

  // Handle share
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (navigator.share) {
      navigator.share({
        title: presentation.title,
        text: `Check out this presentation: ${presentation.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  // Progress calculation
  const progressPercentage = ((currentSlide + 1) / presentation.slides.length) * 100;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{presentation.title}</h1>
          <div className="flex items-center mt-1">
            {presentation.companyLogo ? (
              <img src={presentation.companyLogo} alt={presentation.companyName} className="h-5 w-5 mr-2 rounded-full" />
            ) : (
              <div className="h-5 w-5 mr-2 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-800">
                  {presentation.companyName.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">{presentation.companyName}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-600">{new Date(presentation.date).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-full ${isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-blue-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row">
        {/* Left sidebar - Navigation */}
        <div className={`lg:w-64 border-r border-gray-200 flex-shrink-0 ${showThumbnails ? 'block' : 'hidden'} lg:block`}>
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Slides</h3>
            <span className="text-xs text-gray-500">{presentation.slides.length} slides</span>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-20rem)]">
            {presentation.slides.map((slide, index) => (
              <button
                key={slide.id}
                id={`thumbnail-${index}`}
                onClick={() => navigateToSlide(index)}
                className={`w-full p-2 flex items-start hover:bg-gray-50 ${
                  currentSlide === index ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="w-16 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-2">
                  <img 
                    src={slide.imageUrl} 
                    alt={`Slide ${index + 1} thumbnail`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-xs font-medium text-gray-900 block truncate">
                    {slide.title || `Slide ${index + 1}`}
                  </span>
                  {slide.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{slide.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center - Slide viewer */}
        <div 
          ref={slideContainerRef}
          className="relative flex-1 flex flex-col bg-gray-900"
          {...swipeHandlers}
        >
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <AnimatePresence initial={false} custom={slideDirection}>
              <motion.div
                key={currentSlide}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full h-full flex items-center justify-center"
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.2s ease-in-out"
                }}
              >
                <img
                  src={presentation.slides[currentSlide]?.imageUrl}
                  alt={`Slide ${currentSlide + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="absolute left-4 p-2 rounded-full bg-black bg-opacity-50 text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === presentation.slides.length - 1}
              className="absolute right-4 p-2 rounded-full bg-black bg-opacity-50 text-white disabled:opacity-30"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom toolbar */}
          <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-sm">{currentSlide + 1} / {presentation.slides.length}</div>
              <div className="h-1 w-36 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-1 rounded hover:bg-gray-700 disabled:opacity-50"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <button
                onClick={resetZoom}
                className="p-1 rounded hover:bg-gray-700 text-xs"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className="p-1 rounded hover:bg-gray-700 disabled:opacity-50"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <div className="h-5 border-l border-gray-600 mx-1" />
              <button
                onClick={toggleFullscreen}
                className="p-1 rounded hover:bg-gray-700"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setShowThumbnails(!showThumbnails)}
                className="p-1 rounded hover:bg-gray-700 lg:hidden"
              >
                <FileText className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar - Info */}
        <div className="lg:w-72 border-l border-gray-200 flex-shrink-0 hidden lg:block">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Presentation Details</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase">Company</h4>
                <p className="mt-1 text-sm text-gray-900">{presentation.companyName}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase">Published</h4>
                <div className="mt-1 flex items-center text-sm text-gray-900">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  {new Date(presentation.date).toLocaleDateString()}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase">Slides</h4>
                <div className="mt-1 flex items-center text-sm text-gray-900">
                  <FileText className="mr-2 h-4 w-4 text-gray-400" />
                  {presentation.slideCount} slides
                </div>
              </div>
              
              {presentation.viewCount && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase">Views</h4>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <Eye className="mr-2 h-4 w-4 text-gray-400" />
                    {presentation.viewCount.toLocaleString()}
                  </div>
                </div>
              )}
              
              {presentation.tags && presentation.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase">Tags</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {presentation.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={onDownload}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Presentation
              </button>
              
              <button
                onClick={handleShare}
                className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Presentation
              </button>
              
              <div className="mt-4 text-center">
                <a 
                  href={presentation.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-500 flex items-center justify-center"
                >
                  View original source
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile thumbnails */}
      <div className="lg:hidden border-t border-gray-200 p-2 overflow-x-auto">
        <div className="flex space-x-2">
          {presentation.slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => navigateToSlide(index)}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden ${
                currentSlide === index ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img 
                src={slide.imageUrl} 
                alt={`Slide ${index + 1} thumbnail`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Engagement footer */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <button 
          className="flex items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <ThumbsUp className="mr-1 h-4 w-4" />
          Helpful
        </button>
        
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          Last viewed {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default SequoiaPresentationViewer;