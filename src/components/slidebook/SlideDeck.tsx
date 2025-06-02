import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut, MoreHorizontal } from 'lucide-react';

interface SlideProps {
  id: string;
  content: React.ReactNode;
  background?: string;
}

interface SlidedeckProps {
  slides: SlideProps[];
  currentSlideIndex: number;
  onChangeSlide: (index: number) => void;
}

const SlideDeck: React.FC<SlidedeckProps> = ({ slides, currentSlideIndex, onChangeSlide }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Animation variants
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

  const [direction, setDirection] = useState(0);

  // Navigation functions
  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setDirection(1);
      onChangeSlide(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setDirection(-1);
      onChangeSlide(currentSlideIndex - 1);
    }
  };

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(err => {
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

  // Zoom functions
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setZoom(1);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, isFullscreen]);

  // Listen for fullscreen change events
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-md h-full"
      ref={containerRef}
    >
      {/* Slide display area */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slides[currentSlideIndex].id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              backgroundColor: slides[currentSlideIndex].background || 'white',
              transform: `scale(${zoom})`,
              transition: "transform 0.2s ease-in-out"
            }}
          >
            {slides[currentSlideIndex].content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {currentSlideIndex > 0 && (
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        
        {currentSlideIndex < slides.length - 1 && (
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="p-3 bg-white border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          <div className="h-1 w-36 ml-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-200"
              style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={zoomOut}
            className="p-1 rounded text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Zoom out"
            disabled={zoom <= 0.5}
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={resetZoom}
            className="px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={zoomIn}
            className="p-1 rounded text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Zoom in"
            disabled={zoom >= 2}
          >
            <ZoomIn size={18} />
          </button>
          <div className="mx-1 h-5 border-l border-gray-300"></div>
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            className="p-1 rounded text-gray-500 hover:bg-gray-100 transition-colors ml-1"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideDeck;