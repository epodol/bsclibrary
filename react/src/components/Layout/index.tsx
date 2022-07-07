import React from 'react';
import { Outlet } from 'react-router';
import Navigation from 'src/components/LibraryNavigation';
import Footer from 'src/components/Footer';

const Layout = () => (
  <div className="page">
    <Navigation />
    <main>
      <div className="content">
        <Outlet />
      </div>
    </main>
    <Footer />
  </div>
);

export default Layout;
