import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SlideBookHeader from './slidebook/Header';

const Layout: React.FC = () => {
  const location = useLocation();

  // Check if the current path is for the Slidebook editor or presentation app
  const isSlideBookPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/editor') || 
                          location.pathname.startsWith('/templates') ||
                          location.pathname.startsWith('/account');

  // Don't show footer on editor pages
  const showFooter = !location.pathname.startsWith('/editor/');

  return (
    <div className="flex flex-col min-h-screen">
      {isSlideBookPage ? <SlideBookHeader /> : <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;