import React from 'react';
import { Heart, Instagram, Twitter, Facebook, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white dark:from-gray-900 to-pink-50 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">LoveNotes</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              <span lang="en" className={language === 'en' ? '' : 'hidden'}>
                Create and share beautiful Valentine's cards with your loved ones. Express your feelings with our easy-to-use platform.
              </span>
              <span lang="es" className={language === 'es' ? '' : 'hidden'}>
                Crea y comparte hermosas tarjetas de San Valentín con tus seres queridos. Expresa tus sentimientos con nuestra plataforma fácil de usar.
              </span>
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">
              <span lang="en" className={language === 'en' ? '' : 'hidden'}>Quick Links</span>
              <span lang="es" className={language === 'es' ? '' : 'hidden'}>Enlaces Rápidos</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Features</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Características</span>
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>How it Works</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Cómo Funciona</span>
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Gallery</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Galería</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>FAQ</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Preguntas Frecuentes</span>
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <span lang="en" className={language === 'en' ? '' : 'hidden'}>Privacy Policy</span>
                  <span lang="es" className={language === 'es' ? '' : 'hidden'}>Política de Privacidad</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">
              <span lang="en" className={language === 'en' ? '' : 'hidden'}>Contact Us</span>
              <span lang="es" className={language === 'es' ? '' : 'hidden'}>Contáctanos</span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-5 w-5 mr-2 text-pink-500" />
                <a href="mailto:support@lovenotes.com" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  support@lovenotes.com
                </a>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="h-5 w-5 mr-2 text-pink-500" />
                <a href="tel:+1234567890" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} LoveNotes. 
              <span lang="en" className={language === 'en' ? '' : 'hidden'}> All rights reserved.</span>
              <span lang="es" className={language === 'es' ? '' : 'hidden'}> Todos los derechos reservados.</span>
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                <span lang="en" className={language === 'en' ? '' : 'hidden'}>Terms of Service</span>
                <span lang="es" className={language === 'es' ? '' : 'hidden'}>Términos de Servicio</span>
              </a>
              <a href="#privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                <span lang="en" className={language === 'en' ? '' : 'hidden'}>Privacy Policy</span>
                <span lang="es" className={language === 'es' ? '' : 'hidden'}>Política de Privacidad</span>
              </a>
              <a href="#cookies" className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                <span lang="en" className={language === 'en' ? '' : 'hidden'}>Cookie Policy</span>
                <span lang="es" className={language === 'es' ? '' : 'hidden'}>Política de Cookies</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}