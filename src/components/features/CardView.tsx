import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Share2, Copy, Check, Download, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import SocialShare from '../shared/SocialShare';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface CardViewProps {
  cardId: string;
  onClose?: () => void;
}

interface Card {
  id: string;
  recipient_name: string;
  message: string;
  template: string;
  background_image: string;
  created_at: string;
}

export default function CardView({ cardId, onClose }: CardViewProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCard() {
      try {
        const { data, error } = await supabase
          .from('valentine_cards')
          .select('*')
          .eq('id', cardId)
          .single();

        if (error) throw error;
        setCard(data);
        
        if (data && user) {
          checkIfFavorite(data.id);
        }
      } catch (error) {
        console.error('Error fetching card:', error);
        toast.error(language === 'en' ? 'Could not load the card' : 'No se pudo cargar la tarjeta');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCard();
  }, [cardId, language, user]);

  const checkIfFavorite = async (cardId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('card_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('card_id', cardId)
        .maybeSingle();

      if (error) throw error;
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !card) {
      toast.error(
        language === 'en' 
          ? 'Please sign in to add favorites' 
          : 'Por favor, inicia sesión para agregar favoritos'
      );
      return;
    }

    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('card_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('card_id', card.id);

        if (error) throw error;
        setIsFavorite(false);
        toast.success(
          language === 'en' 
            ? 'Removed from favorites' 
            : 'Eliminado de favoritos'
        );
      } else {
        const { error } = await supabase
          .from('card_favorites')
          .insert([
            {
              user_id: user.id,
              card_id: card.id
            }
          ]);

        if (error) throw error;
        setIsFavorite(true);
        toast.success(
          language === 'en' 
            ? 'Added to favorites' 
            : 'Agregado a favoritos'
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(
        language === 'en'
          ? 'Failed to update favorites'
          : 'Error al actualizar favoritos'
      );
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current || !card) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `valentine-card-${card.recipient_name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
      
      toast.success(
        language === 'en' 
          ? 'Card downloaded successfully!'
          : '¡Tarjeta descargada exitosamente!'
      );
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error(
        language === 'en'
          ? 'Could not download image. Please try again.'
          : 'No se pudo descargar la imagen. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en' ? 'Card not found' : 'Tarjeta no encontrada'}
        </p>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/card/${cardId}`;
  const shareTitle = language === 'en' 
    ? "Valentine's Day Card" 
    : "Tarjeta de San Valentín";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        ref={cardRef}
        className="relative p-8 rounded-lg shadow-lg mb-6 overflow-hidden"
        style={{
          backgroundImage: card.background_image ? `url(${card.background_image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px'
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative">
          <div className="text-center mb-6">
            <Heart className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-white">
            Dear {card.recipient_name},
          </h3>
          <p className="whitespace-pre-wrap text-lg mb-4 text-white">
            {card.message}
          </p>
          <div className="text-sm text-white/80">
            {new Date(card.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'es', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowSocialShare(!showSocialShare)}
            className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            <Share2 className="h-5 w-5 mr-2" />
            {language === 'en' ? 'Share' : 'Compartir'}
          </button>
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex items-center px-4 py-2 border-2 border-pink-500 text-pink-500 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950 transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Download className="h-5 w-5 mr-2" />
            )}
            {language === 'en' ? 'Download' : 'Descargar'}
          </button>
          <button
            onClick={toggleFavorite}
            disabled={isTogglingFavorite}
            className={`flex items-center px-4 py-2 rounded-full transition-colors ${
              isFavorite
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'border-2 border-pink-500 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950'
            }`}
          >
            {isTogglingFavorite ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            )}
            {isFavorite ? (
              language === 'en' ? 'Favorited' : 'Favorito'
            ) : (
              language === 'en' ? 'Add to Favorites' : 'Agregar a Favoritos'
            )}
          </button>
        </div>

        {showSocialShare && (
          <SocialShare 
            url={shareUrl}
            title={shareTitle}
            recipientName={card.recipient_name}
          />
        )}
      </div>
    </div>
  );
}