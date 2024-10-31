"use client";

import React, { useState, useEffect } from 'react';
import MainMenu from './MainMenu';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVerticalMenu, setIsVerticalMenu] = useState(false);

  useEffect(() => {
    const handleOrientationChange = (e: CustomEvent) => {
      setIsVerticalMenu(e.detail.isVertical);
    };

    window.addEventListener('menuOrientationChange', handleOrientationChange as EventListener);
    return () => {
      window.removeEventListener('menuOrientationChange', handleOrientationChange as EventListener);
    };
  }, []);

  return (
    <div className="layout-container">
      <header className="header">
        <div className="header-title">Grekai Stocks test</div>
        {!isVerticalMenu && <MainMenu />}
      </header>
      
      <aside className={`sidebar-left ${!isVerticalMenu ? 'collapsed' : ''}`}>
        {isVerticalMenu && <MainMenu />}
      </aside>
      
      <main className={`main ${isVerticalMenu ? 'with-vertical-menu' : ''}`}>
        {children}
      </main>
      
      <aside className="sidebar-right">
        <div className="sidebar-content">
          SIDEBAR RIGHT
        </div>
      </aside>
      
      <footer className="footer">
        <div className="footer-content">
          © 2024 Grekai Stocks. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout; 