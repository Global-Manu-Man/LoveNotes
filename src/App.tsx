import React from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import HowItWorks from './components/sections/HowItWorks';
import Footer from './components/layout/Footer';
import PublicCardView from './components/features/PublicCardView';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from 'react-hot-toast';

function App() {
  // Extract card ID from URL if present
  const cardId = window.location.pathname.match(/\/card\/([^/]+)/)?.[1];

  // If we have a card ID in the URL, show the public card view
  if (cardId) {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <PublicCardView cardId={cardId} />
            <Toaster position="top-right" />
          </div>
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  // Otherwise show the main app
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Footer />
            <Toaster position="top-right" />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;