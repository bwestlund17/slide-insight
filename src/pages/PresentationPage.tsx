import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Download, 
  Share2, 
  Bookmark, 
  Eye, 
  Clock, 
  ChevronLeft, 
  ExternalLink
} from 'lucide-react';
import PresentationGrid from '../components/PresentationGrid';
import { usePresentationById, usePresentationTags } from '../hooks/useQueries';

const PresentationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: presentation, isLoading } = usePresentationById(id || '');
  const { data: tags } = usePresentationTags(id || '');
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [currentSlide, setCurrentSlide] = React.useState(1);

  React.useEffect(() => {
    if (!isLoading && !presentation) {
      navigate('/not-found');
    }
  }, [presentation, navigate, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!presentation) {
    return null;
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
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

  const nextSlide = () => {
    if (currentSlide < (presentation.slide_count || 30)) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12 fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 md:top-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link 
                to="/explore" 
                className="inline-flex items-center text-sm text-slate-600 hover:text-primary-600 mb-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Explore
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                {presentation.title}
              </h1>
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-outline py-1.5 px-3"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                Share
              </button>
              <button 
                className={`btn ${isBookmarked ? 'bg-primary-50 text-primary-700 border-primary-200' : 'btn-outline'} py-1.5 px-3`}
                onClick={toggleBookmark}
              >
                <Bookmark className={`h-4 w-4 mr-1.5 ${isBookmarked ? 'fill-primary-500' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
              <a 
                href={presentation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary py-1.5 px-3"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Download
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Presentation viewer */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative bg-slate-800 aspect-[4/3]">
                <img 
                  src={presentation.thumbnail_url || `https://picsum.photos/seed/${presentation.id}-${currentSlide}/800/600`}
                  alt={`Slide ${currentSlide}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent py-2 px-4 flex justify-between items-center text-white">
                  <button
                    onClick={prevSlide}
                    disabled={currentSlide === 1}
                    className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="text-sm">
                    Slide {currentSlide} of {presentation.slide_count || 30}
                  </div>
                  <button
                    onClick={nextSlide}
                    disabled={currentSlide === (presentation.slide_count || 30)}
                    className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transform rotate-180"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{presentation.slide_count} slides</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(presentation.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{presentation.view_count?.toLocaleString() || 0} views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6 bg-white rounded-lg border border-slate-200 p-6">
              <div className="mt-6">
                <h4 className="font-medium text-slate-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag, index) => (
                    <Link 
                      key={index}
                      to={`/search?tag=${encodeURIComponent(tag)}`}
                      className="text-sm py-1 px-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* AI summary */}
            {presentation.summary && (
              <div className="mt-6 bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.5c0 .18-.013.357-.037.53l-1.98.16c-.18 1.912-1.03 3.61-2.258 4.823.05.834 0 1.666-.15 2.335-.087.407-.634.683-1.044.577-.832-.216-1.647-.56-2.424-1.024-.776.464-1.591.81-2.424 1.023-.408.107-.956-.17-1.042-.576-.15-.67-.203-1.502-.153-2.335-1.227-1.214-2.078-2.911-2.258-4.822l-1.98-.16A5.499 5.499 0 0 1 3 12.5a5.499 5.499 0 0 1 3.248-5.004 3.998 3.998 0 0 1 7.504 0A5.499 5.499 0 0 1 17 12.5h4z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">AI-Generated Summary</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {presentation.summary}
                </p>
                <div className="mt-4 text-sm text-slate-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Generated on {new Date(presentation.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden sticky top-40">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-medium text-slate-900">Presentation Details</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">File type:</span>
                    <span className="text-sm font-medium text-slate-900">{presentation.file_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Size:</span>
                    <span className="text-sm font-medium text-slate-900">{presentation.file_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Slides:</span>
                    <span className="text-sm font-medium text-slate-900">{presentation.slide_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Published:</span>
                    <span className="text-sm font-medium text-slate-900">
                      {new Date(presentation.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Views:</span>
                    <span className="text-sm font-medium text-slate-900">
                      {presentation.view_count?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="pt-2">
                    <a 
                      href={presentation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                    >
                      View original source
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationPage;