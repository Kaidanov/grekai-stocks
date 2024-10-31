"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import MainMenu from "./components/MainMenu";
import { useState, useEffect } from "react";

// Syncfusion CSS imports
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-grids/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-react-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isVerticalMenu, setIsVerticalMenu] = useState(false);
  const [isRealData, setIsRealData] = useState(true);

  useEffect(() => {
    const handleOrientationChange = (e: CustomEvent) => {
      setIsVerticalMenu(e.detail.isVertical);
    };

    window.addEventListener('menuOrientationChange', handleOrientationChange as EventListener);
    return () => {
      window.removeEventListener('menuOrientationChange', handleOrientationChange as EventListener);
    };
  }, []);

  const handleToggleData = () => {
    setIsRealData(!isRealData);
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('dataSourceChange', { 
      detail: { isRealData: !isRealData } 
    }));
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-container">
          <header className="app-header">
            {!isVerticalMenu && (
              <MainMenu 
                isRealData={isRealData} 
                onToggleData={handleToggleData} 
              />
            )}
          </header>
          
          <div className="app-content">
            <aside className={`sidebar-left ${!isVerticalMenu ? 'collapsed' : ''}`}>
              {isVerticalMenu && (
                <MainMenu 
                  isRealData={isRealData} 
                  onToggleData={handleToggleData} 
                />
              )}
            </aside>
            
            <main className={`main-content ${!isVerticalMenu ? 'full-width' : ''}`}>
              {children}
            </main>
          </div>
          
          <footer className="app-footer">
            © 2024 Grekais Stocks
          </footer>
        </div>
      </body>
    </html>
  );
} 