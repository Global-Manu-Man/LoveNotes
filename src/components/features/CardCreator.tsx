import React, { useState } from 'react';
import { Heart, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const PREDEFINED_IMAGES = [
  {
    id: 'hearts',
    url: 'https://images.unsplash.com/photo-1581022295087-35e593704911?auto=format&fit=crop&q=80',
    alt: 'Pink hearts bokeh background'
  },
  {
    id: 'roses',
    url: 'https://images.unsplash.com/photo-1612160609504-334bdc6b70c9?auto=format&fit=crop&q=80',
    alt: 'Red roses background'
  },
  {
    id: 'candlelight',
    url: 'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?auto=format&fit=crop&q=80',
    alt: 'Romantic candlelight'
  },
  {
    id: 'petals',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80',
    alt: 'Rose petals'
  }
];

interface CardCreatorProps {
  onClose: () => void;
}

export default function CardCreator({ onClose }: CardCreatorProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    message: '',
    template: 'classic',
    backgroundImage: PREDEFINED_IMAGES[0].url
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to create a card');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('valentine_cards')
        .insert({
          recipient_name: formData.recipientName,
          message: formData.message,
          template: formData.template,
          background_image: formData.backgroundImage,
          user_id: user.id
        });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      toast.success('Card created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create card');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreview = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Preview Your Card</h3>
        
        {/* Card Preview */}
        <div className="relative overflow-hidden rounded-xl shadow-2xl aspect-[1200/630]">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105"
            style={{ backgroundImage: `url(${formData.backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center text-white">
            <div className="mb-8">
              <Heart className={`h-16 w-16 text-white ${formData.template === 'modern' ? 'animate-pulse' : ''}`} />
            </div>
            
            <div className={`space-y-6 max-w-2xl ${
              formData.template === 'modern' 
                ? 'bg-white/10 backdrop-blur-sm p-8 rounded-2xl'
                : ''
            }`}>
              <h2 className={`text-4xl font-bold mb-6 ${
                formData.template === 'modern' 
                  ? 'bg-gradient-to-r from-pink-300 to-purple-300 text-transparent bg-clip-text'
                  : ''
              }`}>
                Dear {formData.recipientName},
              </h2>
              
              <p className={`text-xl leading-relaxed whitespace-pre-wrap ${
                formData.template === 'modern'
                  ? 'text-white/90'
                  : ''
              }`}>
                {formData.message}
              </p>
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="bg-pink-50 dark:bg-pink-950/20 rounded-lg p-4 text-sm text-pink-700 dark:text-pink-300">
          <p>Your card will be created with high resolution (1200x630px) for perfect sharing on social media and messaging apps.</p>
        </div>
      </div>
    );
  };

  const renderImageGallery = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Choose a Background Image</h3>
      <div className="grid grid-cols-2 gap-4">
        {PREDEFINED_IMAGES.map((image) => (
          <button
            key={image.id}
            onClick={() => setFormData({ ...formData, backgroundImage: image.url })}
            className={`relative aspect-video rounded-lg overflow-hidden group ${
              formData.backgroundImage === image.url
                ? 'ring-4 ring-pink-500'
                : 'hover:ring-2 hover:ring-pink-300'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {formData.backgroundImage === image.url && (
              <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-4">
      <div className="text-center mb-8">
        <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Valentine's Card</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Express your feelings with a beautiful personalized card</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>1</div>
          <div className={`w-20 h-1 ${step >= 2 ? 'bg-pink-500' : 'bg-gray-200'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>2</div>
          <div className={`w-20 h-1 ${step >= 3 ? 'bg-pink-500' : 'bg-gray-200'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>3</div>
          <div className={`w-20 h-1 ${step >= 4 ? 'bg-pink-500' : 'bg-gray-200'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step >= 4 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>4</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recipient's Name
              </label>
              <input
                type="text"
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:border-pink-500 focus:ring-pink-500 dark:text-white"
                placeholder="Enter recipient's name"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:border-pink-500 focus:ring-pink-500 dark:text-white"
                rows={4}
                placeholder="Write your heartfelt message..."
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, template: 'classic' })}
              className={`p-4 rounded-lg border-2 ${
                formData.template === 'classic'
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
              }`}
            >
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-pink-500" />
              <div className="text-sm font-medium dark:text-white">Classic Template</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, template: 'modern' })}
              className={`p-4 rounded-lg border-2 ${
                formData.template === 'modern'
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
              }`}
            >
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-pink-500" />
              <div className="text-sm font-medium dark:text-white">Modern Template</div>
            </button>
          </div>
        )}

        {step === 3 && renderImageGallery()}

        {step === 4 && renderPreview()}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 text-pink-500 border-2 border-pink-500 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950 transition-colors"
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating...
                </>
              ) : (
                'Create Card'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}