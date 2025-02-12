import React, { useEffect, useState } from 'react';
import { Loader2, Share2, Heart, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Modal from '../shared/Modal';
import CardView from './CardView';
import { useLanguage } from '../../contexts/LanguageContext';

interface Card {
  id: string;
  recipient_name: string;
  message: string;
  template: string;
  created_at: string;
}

interface PublicGalleryProps {
  onClose: () => void;
}

const ITEMS_PER_PAGE = 9; // Number of cards per page

export default function PublicGallery({ onClose }: PublicGalleryProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'classic' | 'modern'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    fetchPublicCards();
  }, [filter, currentPage]);

  const fetchPublicCards = async () => {
    try {
      setIsLoading(true);
      
      // First, get the total count
      let countQuery = supabase
        .from('valentine_cards')
        .select('id', { count: 'exact' });

      if (filter !== 'all') {
        countQuery = countQuery.eq('template', filter);
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;
      setTotalCards(count || 0);

      // Then, get the paginated data
      let query = supabase
        .from('valentine_cards')
        .select('*')
        .order('created_at', { ascending: false })
        .range(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE - 1
        );

      if (filter !== 'all') {
        query = query.eq('template', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching public cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCards / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-pink-200 dark:border-pink-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 dark:hover:bg-pink-900/20"
        >
          <ChevronLeft className="h-5 w-5 text-pink-500" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`w-10 h-10 rounded-lg border ${
                currentPage === 1
                  ? 'bg-pink-500 text-white'
                  : 'border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20'
              }`}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-gray-500 dark:text-gray-400">...</span>
            )}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-lg border ${
                currentPage === page
                  ? 'bg-pink-500 text-white'
                  : 'border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20'
              }`}
            >
              {page}
            </button>
          )
        )}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-500 dark:text-gray-400">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`w-10 h-10 rounded-lg border ${
                currentPage === totalPages
                  ? 'bg-pink-500 text-white'
                  : 'border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-pink-200 dark:border-pink-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 dark:hover:bg-pink-900/20"
        >
          <ChevronRight className="h-5 w-5 text-pink-500" />
        </button>
      </div>
    );
  };

  const renderFeaturedCard = (card: Card) => (
    <div
      key={card.id}
      className={`relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
        card.template === 'classic'
          ? 'bg-white dark:bg-gray-800'
          : 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500'
      }`}
    >
      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
      <div className="relative p-8">
        <div className="flex justify-between items-start mb-6">
          <Heart className={`h-8 w-8 ${card.template === 'classic' ? 'text-pink-500' : 'text-white'}`} />
          <button
            onClick={() => setSelectedCard(card.id)}
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <Share2 className="h-4 w-4 text-pink-500" />
          </button>
        </div>
        <div className={`space-y-4 ${card.template === 'modern' ? 'text-white' : ''}`}>
          <h3 className="text-2xl font-bold">Dear {card.recipient_name},</h3>
          <p className="text-lg leading-relaxed opacity-90">{card.message}</p>
          <div className="pt-4 text-sm opacity-75">
            {new Date(card.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'es', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {language === 'en' ? "Valentine's Gallery" : 'Galería de San Valentín'}
        </h2>
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as 'all' | 'classic' | 'modern');
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300"
          >
            <option value="all">{language === 'en' ? 'All Designs' : 'Todos los Diseños'}</option>
            <option value="classic">{language === 'en' ? 'Classic' : 'Clásico'}</option>
            <option value="modern">{language === 'en' ? 'Modern' : 'Moderno'}</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Sparkles className="h-12 w-12 text-pink-500 mx-auto" />
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {language === 'en'
              ? 'No cards found. Be the first to create a beautiful Valentine\'s card!'
              : '¡No se encontraron tarjetas. ¡Sé el primero en crear una hermosa tarjeta de San Valentín!'}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Featured Cards Section - Only show on first page */}
          {currentPage === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-pink-500" />
                {language === 'en' ? 'Featured Designs' : 'Diseños Destacados'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cards.slice(0, 2).map(renderFeaturedCard)}
              </div>
            </div>
          )}

          {/* All Cards Grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-500" />
              {language === 'en' ? 'All Cards' : 'Todas las Tarjetas'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`p-6 rounded-xl shadow-lg relative group transition-all duration-300 hover:shadow-xl ${
                    card.template === 'classic'
                      ? 'bg-white dark:bg-gray-800 border border-pink-100 dark:border-pink-900'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  }`}
                >
                  <button
                    onClick={() => setSelectedCard(card.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  >
                    <Share2 className="h-4 w-4 text-pink-500" />
                  </button>
                  <h3 className="text-xl font-semibold mb-4">Dear {card.recipient_name},</h3>
                  <p className="whitespace-pre-wrap mb-4 line-clamp-3">{card.message}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(card.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'es', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && renderPagination()}
        </div>
      )}

      <Modal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)}
        size="large"
      >
        {selectedCard && <CardView cardId={selectedCard} onClose={() => setSelectedCard(null)} />}
      </Modal>
    </div>
  );
}