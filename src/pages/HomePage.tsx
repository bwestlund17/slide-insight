import React from 'react';
import { Link } from 'react-router-dom';
import PresentationGrid from '../components/PresentationGrid';
import { Search, ChevronRight, ArrowRight, BarChart2, Calendar, Tag } from 'lucide-react';
import { usePresentations, useIndustryStats } from '../hooks/useQueries';

const HomePage: React.FC = () => {
  const { data: presentations = [], isLoading: presentationsLoading } = usePresentations();
  const { data: industries = [], isLoading: industriesLoading } = useIndustryStats();

  // Get recent presentations (last 7 days)
  const recentPresentations = presentations
    .filter(p => {
      const presentationDate = new Date(p.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return presentationDate >= sevenDaysAgo;
    })
    .slice(0, 5);

  // Get trending presentations (by view count)
  const trendingPresentations = [...presentations]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5);

  // Get featured presentations (with highest view counts and recent dates)
  const featuredPresentations = [...presentations]
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const viewDiff = (b.view_count || 0) - (a.view_count || 0);
      const dateDiff = dateB.getTime() - dateA.getTime();
      return viewDiff + dateDiff / (1000 * 60 * 60 * 24); // Weight both factors
    })
    .slice(0, 3);

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

      {/* Featured Presentations */}
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
              presentations={featuredPresentations} 
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
                  recentPresentations.map(presentation => (
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
                  trendingPresentations.map(presentation => (
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
                            {presentation.view_count?.toLocaleString()} views
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