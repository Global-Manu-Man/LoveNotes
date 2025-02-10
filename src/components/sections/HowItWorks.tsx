import React from 'react';
import { 
  UserPlus, 
  PenTool, 
  Image as ImageIcon, 
  Share 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HowItWorks() {
  const { language } = useLanguage();

  const steps = {
    en: [
      {
        icon: UserPlus,
        title: 'Create an Account',
        description: 'Sign up in seconds to start creating your personalized Valentine\'s cards.'
      },
      {
        icon: PenTool,
        title: 'Write Your Message',
        description: 'Express your feelings with our easy-to-use editor and beautiful templates.'
      },
      {
        icon: ImageIcon,
        title: 'Customize Design',
        description: 'Choose from our collection of backgrounds and styles to make it unique.'
      },
      {
        icon: Share,
        title: 'Share the Love',
        description: 'Share your card instantly or download it for a special delivery.'
      }
    ],
    es: [
      {
        icon: UserPlus,
        title: 'Crea una Cuenta',
        description: 'Regístrate en segundos para comenzar a crear tus tarjetas personalizadas de San Valentín.'
      },
      {
        icon: PenTool,
        title: 'Escribe tu Mensaje',
        description: 'Expresa tus sentimientos con nuestro editor fácil de usar y hermosas plantillas.'
      },
      {
        icon: ImageIcon,
        title: 'Personaliza el Diseño',
        description: 'Elige entre nuestra colección de fondos y estilos para hacerlo único.'
      },
      {
        icon: Share,
        title: 'Comparte el Amor',
        description: 'Comparte tu tarjeta instantáneamente o descárgala para una entrega especial.'
      }
    ]
  };

  const currentSteps = steps[language];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span lang="en" className={language === 'en' ? '' : 'hidden'}>
              How It Works
            </span>
            <span lang="es" className={language === 'es' ? '' : 'hidden'}>
              Cómo Funciona
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            <span lang="en" className={language === 'en' ? '' : 'hidden'}>
              Create your perfect Valentine's card in just a few simple steps
            </span>
            <span lang="es" className={language === 'es' ? '' : 'hidden'}>
              Crea tu tarjeta perfecta de San Valentín en solo unos simples pasos
            </span>
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-pink-200 dark:bg-pink-800 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-pink-100 dark:border-pink-900 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center mb-6 mx-auto">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}