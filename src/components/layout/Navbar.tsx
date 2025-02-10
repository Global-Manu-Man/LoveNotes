import React, { useState, useRef, useEffect } from 'react';
import { Heart, LogOut, Album, Menu, X, Settings, Sun, Moon, Languages } from 'lucide-react';
import Modal from '../shared/Modal';
import CardCreator from '../features/CardCreator';
import CardsGallery from '../features/CardsGallery';
import ThemeToggle from '../shared/ThemeToggle';
import LanguageToggle from '../shared/LanguageToggle';
import AuthModal from '../shared/AuthModal';
import UserSettings from '../features/UserSettings';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateCard = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-pink-100 dark:border-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">LoveNotes</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                <span lang="en" className={language === 'en' ? '' : 'hidden'}>Features</span>
                <span lang="es" className={language === 'es' ? '' : 'hidden'}>Características</span>
              </a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                <span lang="en" className={language === 'en' ? '' : 'hidden'}>How it Works</span>
                <span lang="es" className={language === 'es' ? '' : 'hidden'}>Cómo Funciona</span>
              </a>
              <ThemeToggle />
              <LanguageToggle />
              {user ? (
                <>
                  <button 
                    onClick={() => setIsGalleryOpen(true)}
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                  >
                    <Album className="h-5 w-5 mr-2" />
                    <span lang="en" className={language === 'en' ? '' : 'hidden'}>My Cards</span>
                    <span lang="es" className={language === 'es' ? '' : 'hidden'}>Mis Tarjetas</span>
                  </button>
                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    <span lang="en" className={language === 'en' ? '' : 'hidden'}>Settings</span>
                    <span lang="es" className={language === 'es' ? '' : 'hidden'}>Configuración</span>
                  </button>
                  <button 
                    onClick={handleCreateCard}
                    className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
                  >
                    <span lang="en" className={language === 'en' ? '' : 'hidden'}>Create Card</span>
                    <span lang="es" className={language === 'es' ? '' : 'hidden'}>Crear Tarjeta</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
                >
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Sign In</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Iniciar Sesión</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={menuButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-pink-100 dark:border-pink-900">
            {/* Preferences Section */}
            <div className="py-2 border-b border-pink-100 dark:border-pink-900">
              <div className="grid grid-cols-2 gap-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-5 w-5" />
                      <span lang="en" className={language === 'en' ? '' : 'hidden'}>Dark Mode</span>
                      <span lang="es" className={language === 'es' ? '' : 'hidden'}>Modo Oscuro</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5" />
                      <span lang="en" className={language === 'en' ? '' : 'hidden'}>Light Mode</span>
                      <span lang="es" className={language === 'es' ? '' : 'hidden'}>Modo Claro</span>
                    </>
                  )}
                </button>

                {/* Language Toggle */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <Languages className="h-5 w-5" />
                  {language === 'en' ? 'Español' : 'English'}
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                <span lang="en" className={language === 'en' ? '' : 'hidden'}>Features</span>
                <span lang="es" className={language === 'es' ? '' : 'hidden'}>Características</span>
              </a>
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                <span lang="en" className={language === 'en' ? '' : 'hidden'}>How it Works</span>
                <span lang="es" className={language === 'es' ? '' : 'hidden'}>Cómo Funciona</span>
              </a>
            </div>

            {/* User Actions */}
            {user ? (
              <div className="space-y-3 pt-2 border-t border-pink-100 dark:border-pink-900">
                <button 
                  onClick={() => {
                    setIsGalleryOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full py-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  <Album className="h-5 w-5 mr-2" />
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>My Cards</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Mis Tarjetas</span>
                </button>
                <button 
                  onClick={() => {
                    setIsSettingsOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full py-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Settings</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Configuración</span>
                </button>
                <button 
                  onClick={handleCreateCard}
                  className="w-full bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
                >
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Create Card</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Crear Tarjeta</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full py-2 text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Sign Out</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
              >
                <span lang="en" className={language === 'en' ? '' : 'hidden'}>Sign In</span>
                <span lang="es" className={language === 'es' ? '' : 'hidden'}>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CardCreator onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      </Modal>

      <Modal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} size="large">
        <div className="py-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            <span lang="en" className={language === 'en' ? '' : 'hidden'}>My Valentine Cards</span>
            <span lang="es" className={language === 'es' ? '' : 'hidden'}>Mis Tarjetas de San Valentín</span>
          </h2>
          <CardsGallery />
        </div>
      </Modal>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} size="large">
        <UserSettings />
      </Modal>
    </>
  );
}