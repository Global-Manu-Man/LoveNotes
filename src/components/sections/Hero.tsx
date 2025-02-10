import React, { useState } from 'react';
import { HeartHandshake, ArrowRight } from 'lucide-react';
import Modal from '../shared/Modal';
import CardCreator from '../features/CardCreator';
import AuthModal from '../shared/AuthModal';
import PublicGallery from '../features/PublicGallery';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();

  const handleCreateCard = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="relative bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <HeartHandshake className="h-16 w-16 text-pink-500" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              <span lang="en" className={language === 'en' ? '' : 'hidden'}>
                Express Your Love
                <span className="block text-pink-500">This Valentine's Day</span>
              </span>
              <span lang="es" className={language === 'es' ? '' : 'hidden'}>
                Expresa Tu Amor
                <span className="block text-pink-500">Este San Valentín</span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              <span lang="en" className={language === 'en' ? '' : 'hidden'}>
                Create beautiful, personalized digital Valentine's cards that capture your feelings perfectly. Share your love story with our easy-to-use platform.
              </span>
              <span lang="es" className={language === 'es' ? '' : 'hidden'}>
                Crea hermosas tarjetas digitales de San Valentín personalizadas que capturen tus sentimientos perfectamente. Comparte tu historia de amor con nuestra plataforma fácil de usar.
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleCreateCard}
                className="inline-flex items-center px-8 py-4 bg-pink-500 text-white rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                {user ? (
                  <>
                    <span lang="en" className={language === 'en' ? '' : 'hidden'}>Create Your Card</span>
                    <span lang="es" className={language === 'es' ? '' : 'hidden'}>Crea Tu Tarjeta</span>
                  </>
                ) : (
                  <>
                    <span lang="en" className={language === 'en' ? '' : 'hidden'}>Sign In to Create</span>
                    <span lang="es" className={language === 'es' ? '' : 'hidden'}>Inicia Sesión para Crear</span>
                  </>
                )}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsGalleryOpen(true)}
                className="inline-flex items-center px-8 py-4 border-2 border-pink-500 text-pink-500 rounded-full text-lg font-semibold hover:bg-pink-50 dark:hover:bg-pink-950 transition-colors"
              >
                <span lang="en" className={language === 'en' ? '' : 'hidden'}>View Gallery</span>
                <span lang="es" className={language === 'es' ? '' : 'hidden'}>Ver Galería</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">10k+</div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Cards Created</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Tarjetas Creadas</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">98%</div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Happy Users</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Usuarios Felices</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">50+</div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Templates</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Plantillas</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">24/7</div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Support</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Soporte</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CardCreator onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      </Modal>

      <Modal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} size="large">
        <PublicGallery onClose={() => setIsGalleryOpen(false)} />
      </Modal>
    </>
  );
}