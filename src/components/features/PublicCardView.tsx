import React, { useEffect, useState } from 'react';
import { Loader2, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Card {
  id: string;
  recipient_name: string;
  message: string;
  template: string;
  background_image: string;
  created_at: string;
}

export default function PublicCardView({ cardId }: { cardId: string }) {
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (error) {
        console.error('Error fetching card:', error);
        setError('Could not load the card. It might have been deleted or is not publicly accessible.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCard();
  }, [cardId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <Heart className="h-12 w-12 text-pink-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Card Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'This card could not be found. It might have been deleted or is not publicly accessible.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-pink-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl">
        <div 
          className="relative rounded-lg shadow-xl overflow-hidden"
          style={{
            backgroundImage: card.background_image ? `url(${card.background_image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative p-8 md:p-12">
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-white mx-auto" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Dear {card.recipient_name},
              </h2>
              <p className="text-xl text-white/90 whitespace-pre-wrap leading-relaxed">
                {card.message}
              </p>
              <div className="text-sm text-white/70 text-right">
                {new Date(card.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}