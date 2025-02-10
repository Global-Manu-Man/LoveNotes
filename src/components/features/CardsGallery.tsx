import React, { useEffect, useState } from 'react';
import { Loader2, Share2, Heart, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../shared/Modal';
import CardView from './CardView';

interface Card {
  id: string;
  recipient_name: string;
  message: string;
  template: string;
  background_image: string;
  created_at: string;
}

export default function CardsGallery() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCards() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('valentine_cards')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCards(data || []);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCards();
  }, [user]);

  const renderFeaturedCard = (card: Card) => (
    <div
      key={card.id}
      className="relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
      style={{
        backgroundImage: card.background_image ? `url(${card.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
      <div className="relative p-8">
        <div className="flex justify-between items-start mb-6">
          <Heart className="h-8 w-8 text-white" />
          <button
            onClick={() => setSelectedCard(card.id)}
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <Share2 className="h-4 w-4 text-pink-500" />
          </button>
        </div>
        <div className="space-y-4 text-white">
          <h3 className="text-2xl font-bold">Dear {card.recipient_name},</h3>
          <p className="text-lg leading-relaxed opacity-90">{card.message}</p>
          <div className="pt-4 text-sm opacity-75">
            {new Date(card.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Sparkles className="h-12 w-12 text-pink-500 mx-auto" />
        <p className="text-xl text-gray-600 dark:text-gray-400">
          No cards created yet. Be the first to create a beautiful Valentine's card!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12">
        {/* Featured Cards Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-500" />
            Featured Designs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.slice(0, 2).map(renderFeaturedCard)}
          </div>
        </div>

        {/* All Cards Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" />
            All Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="relative p-6 rounded-xl shadow-lg group transition-all duration-300 hover:shadow-xl overflow-hidden"
                style={{
                  backgroundImage: card.background_image ? `url(${card.background_image})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                <button
                  onClick={() => setSelectedCard(card.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                >
                  <Share2 className="h-4 w-4 text-pink-500" />
                </button>
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-4 text-white">Dear {card.recipient_name},</h3>
                  <p className="whitespace-pre-wrap mb-4 line-clamp-3 text-white/90">{card.message}</p>
                  <div className="text-sm text-white/70">
                    {new Date(card.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)}
        size="large"
      >
        {selectedCard && <CardView cardId={selectedCard} onClose={() => setSelectedCard(null)} />}
      </Modal>
    </>
  );
}