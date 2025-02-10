import React from 'react';
import { 
  Sparkles, 
  Share2, 
  Palette, 
  Download, 
  Shield, 
  Smartphone 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Features() {
  const { language } = useLanguage();

  const features = {
    en: [
      {
        icon: Sparkles,
        title: 'Beautiful Templates',
        description: 'Choose from our carefully crafted templates designed to express your feelings perfectly.'
      },
      {
        icon: Palette,
        title: 'Customizable Design',
        description: 'Personalize your card with beautiful backgrounds, fonts, and layouts that match your style.'
      },
      {
        icon: Share2,
        title: 'Easy Sharing',
        description: 'Share your cards instantly via link, social media, or download them for printing.'
      },
      {
        icon: Shield,
        title: 'Private & Secure',
        description: 'Your cards are protected with enterprise-grade security and privacy controls.'
      },
      {
        icon: Download,
        title: 'High Quality Export',
        description: 'Download your cards in high resolution, perfect for both digital sharing and printing.'
      },
      {
        icon: Smartphone,
        title: 'Mobile Friendly',
        description: 'Create and view cards seamlessly on any device with our responsive design.'
      }
    ],
    es: [
      {
        icon: Sparkles,
        title: 'Hermosas Plantillas',
        description: 'Elige entre nuestras plantillas cuidadosamente diseñadas para expresar tus sentimientos perfectamente.'
      },
      {
        icon: Palette,
        title: 'Diseño Personalizable',
        description: 'Personaliza tu tarjeta con hermosos fondos, fuentes y diseños que coincidan con tu estilo.'
      },
      {
        icon: Share2,
        title: 'Compartir Fácilmente',
        description: 'Comparte tus tarjetas instantáneamente por enlace, redes sociales o descárgalas para imprimir.'
      },
      {
        icon: Shield,
        title: 'Privado y Seguro',
        description: 'Tus tarjetas están protegidas con controles de seguridad y privacidad de nivel empresarial.'
      },
      {
        icon: Download,
        title: 'Exportación de Alta Calidad',
        description: 'Descarga tus tarjetas en alta resolución, perfectas tanto para compartir digitalmente como para imprimir.'
      },
      {
        icon: Smartphone,
        title: 'Compatible con Móviles',
        description: 'Crea y visualiza tarjetas sin problemas en cualquier dispositivo con nuestro diseño responsive.'
      }
    ]
  };

  const currentFeatures = features[language];

  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span lang="en" className={language === 'en' ? '' : 'hidden'}>
              Powerful Features for Perfect Cards
            </span>
            <span lang="es" className={language === 'es' ? '' : 'hidden'}>
              Potentes Funciones para Tarjetas Perfectas
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            <span lang="en" className={language === 'en' ? '' : 'hidden'}>
              Everything you need to create beautiful Valentine's cards that capture your feelings
            </span>
            <span lang="es" className={language === 'es' ? '' : 'hidden'}>
              Todo lo que necesitas para crear hermosas tarjetas de San Valentín que capturen tus sentimientos
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-pink-50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}