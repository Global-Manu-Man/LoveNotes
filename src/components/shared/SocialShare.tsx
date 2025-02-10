import React from 'react';
import { Facebook, Twitter, Link2, Instagram, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

interface SocialShareProps {
  url: string;
  title: string;
  recipientName: string;
}

export default function SocialShare({ url, title, recipientName }: SocialShareProps) {
  const { language } = useLanguage();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const message = language === 'en' 
    ? `Check out this Valentine's card for ${recipientName}!`
    : `¡Mira esta tarjeta de San Valentín para ${recipientName}!`;
  const encodedMessage = encodeURIComponent(message);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(
        language === 'en' 
          ? 'Link copied to clipboard!'
          : '¡Enlace copiado al portapapeles!'
      );
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error(
        language === 'en'
          ? 'Could not copy link. Please try again.'
          : 'No se pudo copiar el enlace. Por favor, inténtalo de nuevo.'
      );
    }
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877f2] hover:bg-[#0d65d9]'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`,
      color: 'bg-[#1da1f2] hover:bg-[#0c85d0]'
    },
    {
      name: 'WhatsApp',
      icon: Phone,
      url: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      color: 'bg-[#25d366] hover:bg-[#1da851]'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      onClick: () => {
        toast.error(
          language === 'en'
            ? 'Please use the download button to share on Instagram'
            : 'Por favor, usa el botón de descarga para compartir en Instagram'
        );
      },
      color: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90'
    }
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {language === 'en' ? 'Share on Social Media' : 'Compartir en Redes Sociales'}
      </h3>
      
      <div className="flex flex-wrap justify-center gap-3">
        {shareButtons.map((button) => (
          <button
            key={button.name}
            onClick={() => {
              if (button.onClick) {
                button.onClick();
              } else if (button.url) {
                window.open(button.url, '_blank', 'noopener,noreferrer');
              }
            }}
            className={`${button.color} text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110`}
            aria-label={`Share on ${button.name}`}
          >
            <button.icon className="h-5 w-5" />
          </button>
        ))}
        
        <button
          onClick={handleCopyLink}
          className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
          aria-label="Copy link"
        >
          <Link2 className="h-5 w-5" />
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
        {language === 'en' 
          ? 'Share this card with your friends and family!'
          : '¡Comparte esta tarjeta con tus amigos y familia!'}
      </p>
    </div>
  );
}