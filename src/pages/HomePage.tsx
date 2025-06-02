import React from 'react';
import { Link } from 'react-router-dom';
import PresentationGrid from '../components/PresentationGrid';
import PresentationCollection from '../components/PresentationCollection';
import { Search, ChevronRight, ArrowRight, BarChart2, Calendar, Tag } from 'lucide-react';
import { usePresentations, useIndustryStats } from '../hooks/useQueries';

// Mock featured presentations for Sequoia style showcase
const featuredPresentations = [
  {
    id: 'sequoia-capital-pitch-deck',
    title: 'Sequoia Capital Pitch Deck Template',
    companyName: 'Sequoia Capital',
    thumbnailUrl: 'https://picsum.photos/seed/sequoia/800/600',
    date: '2023-08-15',
    viewCount: 24863,
    slideCount: 20,
    isBookmarked: false,
    isFeatured: true
  },
  {
    id: 'airbnb-pitch-deck',
    title: 'Airbnb Pitch Deck',
    companyName: 'Airbnb',
    thumbnailUrl: 'https://picsum.photos/seed/airbnb/800/600',
    date: '2009-03-21',
    viewCount: 56932,
    slideCount: 14,
    isBookmarked: true
  },
  {
    id: 'uber-pitch-deck',
    title: 'Uber Pitch Deck',
    companyName: 'Uber',
    thumbnailUrl: 'https://picsum.photos/seed/uber/800/600',
    date: '2008-10-15',
    viewCount: 48123,
    slideCount: 25,
    isNew: true
  },
  {
    id: 'facebook-pitch-deck',
    title: 'Facebook Series B Pitch Deck',
    companyName: 'Facebook',
    thumbnailUrl: 'https://picsum.photos/seed/facebook/800/600',
    date: '2005-05-26',
    viewCount: 39754,
    slideCount: 18
  },
  {
    id: 'linkedin-pitch-deck',
    title: 'LinkedIn Series B Pitch Deck',
    companyName: 'LinkedIn',
    thumbnailUrl: 'https://picsum.photos/seed/linkedin/800/600',
    date: '2004-08-07',
    viewCount: 35871,
    slideCount: 37
  }
];

const trendingPresentations = [
  {
    id: 'tesla-investor-day',
    title: 'Tesla Investor Day 2023',
    companyName: 'Tesla',
    thumbnailUrl: 'https://picsum.photos/seed/tesla/800/600',
    date: '2023-03-01',
    viewCount: 89542,
    slideCount: 42,
    isNew: true
  },
  {
    id: 'amazon-shareholder',
    title: 'Amazon Annual Shareholder Meeting',
    companyName: 'Amazon',
    thumbnailUrl: 'https://picsum.photos/seed/amazon/800/600',
    date: '2023-05-24',
    viewCount: 67321,
    slideCount: 35
  },
  {
    id: 'apple-q3-2023',
    title: 'Apple Q3 2023 Earnings Call',
    companyName: 'Apple',
    thumbnailUrl: 'https://picsum.photos/seed/apple/800/600',
    date: '2023-08-03',
    viewCount: 72156,
    slideCount: 28,
    isBookmarked: true
  },
  {
    id: 'microsoft-build',
    title: 'Microsoft Build 2023 Keynote',
    companyName: 'Microsoft',
    thumbnailUrl: 'https://picsum.photos/seed/microsoft/800/600',
    date: '2023-05-23',
    viewCount: 63489,
    slideCount: 52
  },
  {
    id: 'google-io',
    title: 'Google I/O 2023 Presentation',
    companyName: 'Google',
    thumbnailUrl: 'https://picsum.photos/seed/google/800/600',
    date: '2023-05-10',
    viewCount: 81245,
    slideCount: 47
  }
];

const recentPresentations = [
  {
    id: 'nvidia-computex',
    title: 'NVIDIA Computex 2023 Keynote',
    companyName: 'NVIDIA',
    thumbnailUrl: 'https://picsum.photos/seed/nvidia/800/600',
    date: '2023-05-29',
    viewCount: 52148,
    slideCount: 39,
    isNew: true
  },
  {
    id: 'shopify-reunite',
    title: 'Shopify Reunite 2023',
    companyName: 'Shopify',
    thumbnailUrl: 'https://picsum.photos/seed/shopify/800/600',
    date: '2023-05-05',
    viewCount: 38742,
    slideCount: 31
  },
  {
    id: 'stripe-sessions',
    title: 'Stripe Sessions 2023',
    companyName: 'Stripe',
    thumbnailUrl: 'https://picsum.photos/seed/stripe/800/600',
    date: '2023-04-27',
    viewCount: 41863,
    slideCount: 34,
    isBookmarked: true
  },
  {
    id: 'zoom-keynote',
    title: 'Zoom Platform Innovations 2023',
    companyName: 'Zoom',
    thumbnailUrl: 'https://picsum.photos/seed/zoom/800/600',
    date: '2023-04-13',
    viewCount: 45289,
    slideCount: 29
  },
  {
    id: 'salesforce-dreamforce',
    title: 'Salesforce Dreamforce 2023 Keynote',
    companyName: 'Salesforce',
    thumbnailUrl: 'https://picsum.photos/seed/salesforce/800/600',
    date: '2023-09-12',
    viewCount: 37926,
    slideCount: 43,
    isFeatured: true
  }
];

const HomePage: React.FC = () => {
  const { data: presentations = [], isLoading: presentationsLoading } = usePresentations();
  const { data: industries = [], isLoading: industriesLoading } = useIndustryStats();

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              AI-Powered Insights from Russell 2000 Company Presentations
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              Automatically scrape, analyze, and tag public company presentations to stay ahead of market trends
            </p>

            <div className="max-w-xl mx-auto relative">
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="search"
                  placeholder="Search by company, industry, or topic..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-1.5 rounded-full hover:bg-primary-700 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-xs text-slate-500">Popular:</span>
              <Link to="/search?q=quarterly%20results" className="text-xs text-primary-600 hover:text-primary-800 hover:underline">
                Quarterly Results
              </Link>
              <Link to="/search?q=investor%20day" className="text-xs text-primary-600 hover:text-primary-800 hover:underline">
                Investor Day
              </Link>
              <Link to="/search?q=acquisition" className="text-xs text-primary-600 hover:text-primary-800 hover:underline">
                Acquisitions
              </Link>
              <Link to="/search?q=market%20expansion" className="text-xs text-primary-600 hover:text-primary-800 hover:underline">
                Market Expansion
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sequoia Style Presentation Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sequoia Capital Presentation Collection</h2>
            <p className="mt-2 text-gray-600">
              Explore our curated collection of pitch decks and investor presentations in Sequoia-style format
            </p>
          </div>
          
          <PresentationCollection
            title="Featured Presentations"
            subtitle="Our most popular startup pitch decks and investor presentations"
            presentations={featuredPresentations}
            viewAllLink="/sequoia/presentations"
          />
          
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PresentationCollection
              title="Trending Now"
              presentations={trendingPresentations.slice(0, 3)}
              viewAllLink="/sequoia/trending"
            />
            
            <PresentationCollection
              title="Recently Added"
              presentations={recentPresentations.slice(0, 3)}
              viewAllLink="/sequoia/recent"
            />
          </div>
        </div>
      </section>
      
      {/* Original Featured Presentations Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Featured Presentations</h2>
            <Link to="/explore" className="text-sm text-primary-600 hover:text-primary-800 flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          {presentationsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 h-48 rounded-t-lg"></div>
                  <div className="bg-white p-4 rounded-b-lg border border-slate-200">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-slate-200 rounded w-20"></div>
                      <div className="h-6 bg-slate-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PresentationGrid 
              presentations={presentations.slice(0, 6)} 
              columns={3} 
              variant="featured" 
            />
          )}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Use SlideInsight?</h2>
            <p className="text-lg text-slate-600">
              Gain deeper insights into market trends and company strategies with our AI-powered presentation analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Comprehensive Coverage</h3>
              <p className="text-slate-600">
                Automatically scrapes and analyzes all presentations from Russell 2000 companies
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <Tag className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Tagging</h3>
              <p className="text-slate-600">
                AI-powered analysis categorizes content with accurate, relevant tags
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent-100 text-accent-600 mb-4">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Trend Insights</h3>
              <p className="text-slate-600">
                Discover emerging patterns and trends across industries and companies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent and Trending */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Presentations */}
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-slate-900">Recently Added</h2>
              </div>
              <div className="space-y-3">
                {presentationsLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  presentations.slice(0, 5).map(presentation => (
                    <div key={presentation.id} className="card hover:bg-slate-50 transition-colors">
                      <div className="p-3">
                        <Link 
                          to={`/presentation/${presentation.id}`}
                          className="block text-sm font-medium text-slate-900 hover:text-primary-600"
                        >
                          {presentation.title}
                        </Link>
                        <div className="flex items-center justify-between mt-1">
                          <Link 
                            to={`/company/${presentation.company_symbol}`}
                            className="text-xs text-accent-600 hover:text-accent-700"
                          >
                            {presentation.companies?.name}
                          </Link>
                          <span className="text-xs text-slate-500">
                            {new Date(presentation.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div className="text-center pt-2">
                  <Link 
                    to="/explore?filter=recent"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                  >
                    See all recent <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Trending Presentations */}
            <div>
              <div className="flex items-center mb-4">
                <BarChart2 className="h-5 w-5 text-secondary-600 mr-2" />
                <h2 className="text-xl font-bold text-slate-900">Trending Now</h2>
              </div>
              <div className="space-y-3">
                {presentationsLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  presentations
                    .slice(0, 5)
                    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                    .map(presentation => (
                    <div key={presentation.id} className="card hover:bg-slate-50 transition-colors">
                      <div className="p-3">
                        <Link 
                          to={`/presentation/${presentation.id}`}
                          className="block text-sm font-medium text-slate-900 hover:text-primary-600"
                        >
                          {presentation.title}
                        </Link>
                        <div className="flex items-center justify-between mt-1">
                          <Link 
                            to={`/company/${presentation.company_symbol}`}
                            className="text-xs text-accent-600 hover:text-accent-700"
                          >
                            {presentation.companies?.name}
                          </Link>
                          <span className="text-xs text-slate-500">
                            {presentation.view_count?.toLocaleString() || 0} views
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div className="text-center pt-2">
                  <Link 
                    to="/explore?filter=trending"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                  >
                    See all trending <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Industry */}
      <section className="bg-slate-50 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Industry</h2>
          {industriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {industries.map(industry => (
                <Link 
                  key={industry.id}
                  to={`/explore?industry=${encodeURIComponent(industry.name)}`}
                  className="bg-white p-4 rounded-lg border border-slate-200 text-center hover:border-primary-300 hover:shadow-sm transition-all group"
                >
                  <h3 className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{industry.count} presentations</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Ahead of Market Trends</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Get weekly updates on the latest presentations and insights from companies in your watchlist
          </p>
          <div className="max-w-md mx-auto">
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-l-md border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900"
              />
              <button 
                type="submit" 
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-r-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-primary-200 text-xs mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;