import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Share2, Copy, Check, Download, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';

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
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
        toast.error('Could not load the card');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCard();
  }, [cardId]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/card/${cardId}`;
    
    try {
      if (navigator.share && window.isSecureContext) {
        await navigator.share({
          title: 'Valentine Card',
          text: `Check out this Valentine's card for ${card?.recipient_name}`,
          url: shareUrl,
        });
        toast.success('Card shared successfully!');
      } else {
        handleCopyLink();
      }
    } catch (error) {
      console.log('Falling back to clipboard copy');
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/card/${cardId}`;
    try {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Could not copy link. Please try again.');
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current || !card) return;

    setIsDownloading(true);
    try {
      // Create a temporary container for the download version
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      // Create the download version of the card
      const downloadCard = document.createElement('div');
      downloadCard.style.width = '1200px';
      downloadCard.style.height = '630px';
      downloadCard.style.position = 'relative';
      downloadCard.style.backgroundColor = '#ffffff';
      downloadCard.style.backgroundImage = `url(${card.background_image})`;
      downloadCard.style.backgroundSize = 'cover';
      downloadCard.style.backgroundPosition = 'center';
      downloadCard.style.padding = '40px';
      downloadCard.style.boxSizing = 'border-box';
      downloadCard.style.fontFamily = 'system-ui, -apple-system, sans-serif';

      // Add overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
      downloadCard.appendChild(overlay);

      // Add content container
      const content = document.createElement('div');
      content.style.position = 'relative';
      content.style.zIndex = '1';
      content.style.height = '100%';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      content.style.alignItems = 'center';
      content.style.justifyContent = 'center';
      content.style.color = '#ffffff';
      content.style.textAlign = 'center';

      // Add heart icon
      const heartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      heartSvg.setAttribute('width', '64');
      heartSvg.setAttribute('height', '64');
      heartSvg.setAttribute('viewBox', '0 0 24 24');
      heartSvg.setAttribute('fill', 'none');
      heartSvg.setAttribute('stroke', 'currentColor');
      heartSvg.setAttribute('stroke-width', '2');
      heartSvg.setAttribute('stroke-linecap', 'round');
      heartSvg.setAttribute('stroke-linejoin', 'round');
      heartSvg.innerHTML = '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>';
      heartSvg.style.marginBottom = '24px';
      content.appendChild(heartSvg);

      // Add recipient name
      const recipientName = document.createElement('h2');
      recipientName.textContent = `Dear ${card.recipient_name},`;
      recipientName.style.fontSize = '48px';
      recipientName.style.fontWeight = 'bold';
      recipientName.style.marginBottom = '24px';
      content.appendChild(recipientName);

      // Add message
      const message = document.createElement('p');
      message.textContent = card.message;
      message.style.fontSize = '24px';
      message.style.lineHeight = '1.5';
      message.style.maxWidth = '800px';
      message.style.margin = '0 auto';
      content.appendChild(message);

      downloadCard.appendChild(content);
      container.appendChild(downloadCard);

      // Capture the card
      const canvas = await html2canvas(downloadCard, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      // Clean up
      document.body.removeChild(container);

      // Download the image
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `valentine-card-${card.recipient_name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
      
      toast.success('Card downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Could not download image. Please try again.');
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
        <p className="text-gray-600 dark:text-gray-400">Card not found</p>
      </div>
    );
  }

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
            {new Date(card.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleShare}
          className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center px-4 py-2 border-2 border-pink-500 text-pink-500 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950 transition-colors"
        >
          {isCopied ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <Copy className="h-5 w-5 mr-2" />
          )}
          Copy Link
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
          Download
        </button>
      </div>
    </div>
  );
}