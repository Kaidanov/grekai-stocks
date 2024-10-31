import { Metadata } from "next";
import "./globals.css";
import { Suspense } from 'react';
import MainMenu from './components/MainMenu';

export const metadata: Metadata = {
  title: "Grekai Stocks test",
  description: "Grekai Stocks test",
};

// Loading component for the entire layout
const LayoutLoading = () => <div>Loading...</div>;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <header className="header">
            <h1>Grekai Stocks test </h1>
          </header>
          
          <main className="main">
            <Suspense fallback={<LayoutLoading />}>
              <MainMenu />
              {children}
            </Suspense>
          </main>
          
          <footer className="footer">
            <p>© 2024 Grekai Stocks test. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
} 