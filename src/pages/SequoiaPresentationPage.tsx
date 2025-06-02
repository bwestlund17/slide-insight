import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bookmark, 
  Download, 
  FileText, 
  Clock, 
  Calendar, 
  Eye, 
  ArrowUpRight,
  Plus,
  Heart,
  Share2,
  ThumbsUp
} from 'lucide-react';
import SequoiaPresentationViewer from '../components/SequoiaPresentationViewer';

// Mocked Sequoia presentation data for demonstration
const mockPresentationData = {
  id: 'sequoia-capital-pitch-deck',
  title: 'Sequoia Capital Pitch Deck Template',
  companyName: 'Sequoia Capital',
  companyLogo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1460141724/k6wb54krzj3esgpqsogu.png',
  date: '2023-08-15',
  slideCount: 20,
  viewCount: 24863,
  tags: ['Pitch Deck', 'Venture Capital', 'Startup', 'Funding'],
  slides: Array.from({ length: 20 }).map((_, i) => ({
    id: `slide-${i+1}`,
    number: i+1,
    imageUrl: `https://picsum.photos/seed/${i+100}/1200/800`,
    title: i === 0 ? 'Company Overview' : 
           i === 1 ? 'Problem Statement' : 
           i === 2 ? 'Solution' :
           i === 3 ? 'Market Opportunity' :
           i === 4 ? 'Product Demo' :
           i === 5 ? 'Business Model' :
           i === 6 ? 'Go-to-Market Strategy' :
           i === 7 ? 'Competitive Analysis' :
           i === 8 ? 'Team' :
           i === 9 ? 'Traction & Metrics' :
           i === 10 ? 'Financial Projections' :
           i === 11 ? 'Funding Ask' :
           `Slide ${i+1}`,
    description: i < 12 ? `Detailed explanation for ${i === 0 ? 'Company Overview' : 
                          i === 1 ? 'Problem Statement' : 
                          i === 2 ? 'Solution' :
                          i === 3 ? 'Market Opportunity' :
                          i === 4 ? 'Product Demo' :
                          i === 5 ? 'Business Model' :
                          i === 6 ? 'Go-to-Market Strategy' :
                          i === 7 ? 'Competitive Analysis' :
                          i === 8 ? 'Team' :
                          i === 9 ? 'Traction & Metrics' :
                          i === 10 ? 'Financial Projections' :
                          i === 11 ? 'Funding Ask' :
                          `Slide ${i+1}`}` : undefined
  })),
  downloadUrl: 'https://example.com/sequoia-capital-pitch-deck.pdf',
  relatedPresentations: [
    {
      id: 'airbnb-pitch-deck',
      title: 'Airbnb Pitch Deck',
      companyName: 'Airbnb',
      thumbnailUrl: 'https://picsum.photos/seed/airbnb/300/200',
      date: '2009-03-21',
      slideCount: 14,
      viewCount: 56932
    },
    {
      id: 'uber-pitch-deck',
      title: 'Uber Pitch Deck',
      companyName: 'Uber',
      thumbnailUrl: 'https://picsum.photos/seed/uber/300/200',
      date: '2008-10-15',
      slideCount: 25,
      viewCount: 48123
    },
    {
      id: 'linkedin-pitch-deck',
      title: 'LinkedIn Series B Pitch Deck',
      companyName: 'LinkedIn',
      thumbnailUrl: 'https://picsum.photos/seed/linkedin/300/200',
      date: '2004-08-07',
      slideCount: 37,
      viewCount: 35871
    }
  ]
};

const SequoiaPresentationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(mockPresentationData);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // In a real app, we would fetch the presentation data here
    // For now, we're using the mock data
    setTimeout(() => {
      setLoading(false);
    }, 500);
    
    // Track page view
    document.title = `${mockPresentationData.title} | Slidebook`;
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, we would save this to the database
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, we would save this to the database
  };
  
  const handleDownload = () => {
    // In a real app, this would download the file
    window.open(presentation.downloadUrl, '_blank');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/presentations" className="text-gray-500 hover:text-gray-700 flex items-center">
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span className="text-sm">Back to Presentations</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBookmark}
                className={`p-2 rounded-full ${isBookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'}`}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-blue-500' : ''}`} />
              </button>
              <button 
                onClick={handleLike}
                className={`p-2 rounded-full ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{presentation.title}</h1>
          <div className="mt-2 flex items-center">
            <img 
              src={presentation.companyLogo} 
              alt={presentation.companyName} 
              className="h-6 w-6 rounded-full mr-2"
            />
            <span className="text-sm font-medium text-gray-700">{presentation.companyName}</span>
            <span className="mx-2 text-gray-300">•</span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(presentation.date).toLocaleDateString()}
            </div>
            <span className="mx-2 text-gray-300">•</span>
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="h-4 w-4 mr-1" />
              {presentation.viewCount?.toLocaleString()} views
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:gap-6">
          {/* Main presentation viewer */}
          <div>
            <SequoiaPresentationViewer
              presentation={presentation}
              onBookmark={handleBookmark}
              onDownload={handleDownload}
              onShare={handleShare}
            />
          </div>
          
          {/* Related presentations section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Related Presentations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {presentation.relatedPresentations.map(related => (
                <div key={related.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video">
                    <img 
                      src={related.thumbnailUrl} 
                      alt={related.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-1 rounded">
                      {related.slideCount} slides
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{related.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-gray-500">{related.companyName}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {related.viewCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 border-dashed overflow-hidden flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-gray-900">Browse More</h3>
                  <p className="mt-1 text-xs text-gray-500">Discover similar presentations in our library</p>
                  <div className="mt-3">
                    <Link
                      to="/presentations"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      View All
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comments/Feedback section */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Feedback & Discussion</h3>
              <button className="text-sm text-blue-600 hover:text-blue-500">View all</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-medium text-blue-800">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-700 mt-1">
                    This presentation template is incredibly useful. I especially liked the market sizing section on slide 4.
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <button className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Like
                    </button>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="font-medium text-green-800">SM</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Sarah Miller</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Used this as a reference for our recent pitch to investors. The structure was perfect for our SaaS business.
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <button className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Like
                    </button>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-200">
                <form className="relative">
                  <textarea
                    rows={3}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add your comment..."
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequoiaPresentationPage;