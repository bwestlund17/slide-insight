import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Github, Twitter, Linkedin, Mail, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center" aria-label="SlideInsight home">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-slate-900">SlideInsight</span>
            </Link>
            <p className="mt-3 text-sm text-slate-600">
              Automatically analyze and tag corporate presentations and M&A decks
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-slate-500 hover:text-primary-600">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-primary-600">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-primary-600">
                <span className="sr-only">Github</span>
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-primary-600">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/explore" className="text-sm text-slate-600 hover:text-primary-600">
                  All Presentations
                </Link>
              </li>
              <li>
                <Link to="/sequoia/sequoia-capital-pitch-deck" className="text-sm text-slate-600 hover:text-primary-600">
                  Sequoia Template
                </Link>
              </li>
              <li>
                <Link to="/ma-decks" className="text-sm text-slate-600 hover:text-primary-600">
                  M&A Decks
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=industries" className="text-sm text-slate-600 hover:text-primary-600">
                  Industries
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=trending" className="text-sm text-slate-600 hover:text-primary-600">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=recent" className="text-sm text-slate-600 hover:text-primary-600">
                  Recently Added
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Cookie Policy
                </a>
              </li>
              <li>
                <Link to="/admin" className="text-sm text-slate-600 hover:text-primary-600 flex items-center">
                  <Lock className="h-3.5 w-3.5 mr-1" />
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} SlideInsight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;