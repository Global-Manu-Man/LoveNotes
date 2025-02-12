import React, { useState, useRef } from 'react';
import { Heart, Image as ImageIcon, Sparkles, Loader2, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
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
  },
  {
    id: 'sunset',
    url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&q=80',
    alt: 'Romantic sunset'
  },
  {
    id: 'flowers',
    url: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&q=80',
    alt: 'Beautiful flowers'
  },
  {
    id: 'hearts-bokeh',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80',
    alt: 'Hearts bokeh lights'
  },
  {
    id: 'beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
    alt: 'Romantic beach'
  },
  {
    id: 'lanterns',
    url: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&q=80',
    alt: 'Romantic lanterns'
  },
  {
    id: 'cherry-blossoms',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80',
    alt: 'Cherry blossoms'
  }
];

interface CardCreatorProps {
  onClose: () => void;
}

function CardCreator({ onClose }: CardCreatorProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientGender: 'female' as 'male' | 'female',
    message: '',
    template: 'classic',
    backgroundImage: ''
  });

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No se pudo obtener el contexto del canvas"));
            return;
          }
  
          const targetWidth = 1200;
          const targetHeight = 630;
  
          // Obtener el aspecto de la imagen original
          const imgAspectRatio = img.width / img.height;
          const targetAspectRatio = targetWidth / targetHeight;
  
          let newWidth, newHeight, offsetX, offsetY;
  
          if (imgAspectRatio > targetAspectRatio) {
            // Imagen más ancha que el objetivo: recortar ancho
            newHeight = targetHeight;
            newWidth = img.width * (targetHeight / img.height);
            offsetX = (newWidth - targetWidth) / 2;
            offsetY = 0;
          } else {
            // Imagen más alta que el objetivo: recortar altura
            newWidth = targetWidth;
            newHeight = img.height * (targetWidth / img.width);
            offsetX = 0;
            offsetY = (newHeight - targetHeight) / 2;
          }
  
          // Configurar el tamaño del canvas
          canvas.width = targetWidth;
          canvas.height = targetHeight;
  
          // Dibujar la imagen en el canvas con recorte centrado
          ctx.drawImage(
            img, 
            -offsetX, -offsetY, 
            newWidth, newHeight
          );
  
          // Convertir el canvas a Blob
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Error al redimensionar y recortar la imagen"));
          }, "image/jpeg", 0.9); // Calidad 90%
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  
  

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast(
        language === "en" ? "Maximum file size is 5MB" : "Tamaño máximo 5MB",
        {
          icon: '⚠️'
        }
      );
      return;
    }
  

    setIsUploading(true);
    try {
      // Resize image if needed
      const resizedBlob = await resizeImage(file);
      const resizedFile = new File([resizedBlob], file.name, { type: 'image/jpeg' });

      const fileExt = 'jpg'; // Always use jpg for consistency
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      // Subir la imagen redimensionada a Supabase Storage
    const { error: uploadError } = await supabase.storage
    .from("valentine-backgrounds")
    .upload(filePath, resizedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('valentine-backgrounds')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, backgroundImage: publicUrl }));
      toast.success(
        language === 'en'
          ? 'Image uploaded successfully'
          : 'Imagen subida exitosamente'
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(
        language === 'en'
          ? 'Failed to upload image'
          : 'Error al subir la imagen'
      );
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Move outside handleSubmit
  const handleNextStep = () => {
    if (!formData.recipientName.trim()) {
      toast(language === "en" ? "Recipient's Name is required" : "El nombre del destinatario es obligatorio", { icon: '⚠️' });
      return;
    }
    if (!formData.recipientGender) {
      toast(language === "en" ? "Recipient's Gender is required" : "El género del destinatario es obligatorio", { icon: '⚠️' });
      return;
    }
    if (!formData.message.trim()) {
      toast(language === "en" ? "Your Message is required" : "El mensaje es obligatorio", { icon: '⚠️' });
      return;
    }
    if (step === 3) {
      setStep(4);
      return;
    }
       // 🔹 Si no es el paso 3, simplemente avanzamos al siguiente paso
       setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


      // 🔹 Solo permitir el envío si estamos en la etapa final (paso 4)
  if (step !== 4) return;
    
    if (!user) {
      toast.error(
        language === 'en'
          ? 'Please sign in to create a card'
          : 'Por favor, inicia sesión para crear una tarjeta'
      );
      return;
    }

    if (!formData.backgroundImage || !formData.backgroundImage.startsWith('http')) {
      toast(
        language === 'en'
          ? 'Please upload a valid background image'
          : 'Por favor, sube una imagen de fondo válida',
        {
          icon: 'ℹ️'
        }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('valentine_cards')
        .insert({
          recipient_name: formData.recipientName,
          recipient_gender: formData.recipientGender,
          message: formData.message,
          template: formData.template,
          background_image: formData.backgroundImage,
          user_id: user.id
        });

      if (error) throw error;

      toast.success(
        language === 'en'
          ? 'Card created successfully!'
          : '¡Tarjeta creada exitosamente!'
      );
      onClose();
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error(
        language === 'en'
          ? 'Failed to create card'
          : 'Error al crear la tarjeta'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreview = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          {language === 'en' ? 'Preview Your Card' : 'Vista Previa de tu Tarjeta'}
        </h3>
        
        {/* Card Preview */}
        <div className="relative overflow-hidden rounded-xl shadow-2xl aspect-[1200/630] w-full max-w-4xl mx-auto">
          <img 
              src={formData.backgroundImage}
              alt="Card background"
              className="absolute inset-0 w-full h-full object-cover object-center"
          />
          
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
                {language === 'en' ? 'Dear' : formData.recipientGender === 'female' ? 'Querida' : 'Querido'} {formData.recipientName},
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
          <p>
            {language === 'en'
              ? 'Your card will be created with high resolution (1200x630px) for perfect sharing on social media and messaging apps.'
              : 'Tu tarjeta será creada en alta resolución (1200x630px) para compartir perfectamente en redes sociales y apps de mensajería.'}
          </p>
        </div>
      </div>
    );
  };

  const renderImageGallery = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        {language === 'en' ? 'Choose a Background Image' : 'Elige una Imagen de Fondo'}
      </h3>

      {/* Upload button */}
      <div className="mb-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full p-4 border-2 border-dashed border-pink-300 dark:border-pink-700 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-pink-500" />
          ) : (
            <Upload className="h-5 w-5 text-pink-500" />
          )}
          <span className="text-gray-700 dark:text-gray-300">
            {language === 'en' 
              ? 'Upload your own image'
              : 'Sube tu propia imagen'}
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Predefined images grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {PREDEFINED_IMAGES.map((image) => (
          <button
            key={image.id}
            onClick={() => setFormData(prev => ({ ...prev, backgroundImage: image.url }))}
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
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {language === 'en' ? 'Create Your Valentine\'s Card' : 'Crea tu Tarjeta de San Valentín'}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {language === 'en'
            ? 'Express your feelings with a beautiful personalized card'
            : 'Expresa tus sentimientos con una hermosa tarjeta personalizada'}
        </p>
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
                {language === 'en' ? 'Recipient\'s Name' : 'Nombre del Destinatario'}
              </label>
              <input
                type="text"
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:border-pink-500 focus:ring-pink-500 dark:text-white"
                placeholder={language === 'en' ? 'Enter recipient\'s name' : 'Ingresa el nombre del destinatario'}
                required
              />
            </div>
            <div>
              <label htmlFor="recipientGender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'en' ? 'Recipient\'s Gender' : 'Género del Destinatario'}
              </label>
              <select
                id="recipientGender"
                value={formData.recipientGender}
                onChange={(e) => setFormData({ ...formData, recipientGender: e.target.value as 'male' | 'female' })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:border-pink-500 focus:ring-pink-500 dark:text-white"
                required
              >
                <option value="female">{language === 'en' ? 'Female' : 'Femenino'}</option>
                <option value="male">{language === 'en' ? 'Male' : 'Masculino'}</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'en' ? 'Your Message' : 'Tu Mensaje'}
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:border-pink-500 focus:ring-pink-500 dark:text-white"
                rows={4}
                placeholder={language === 'en' ? 'Write your heartfelt message...' : 'Escribe tu mensaje del corazón...'}
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, template: 'classic' }))}
              className={`p-4 rounded-lg border-2 ${
                formData.template === 'classic'
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
              }`}
            >
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-pink-500" />
              <div className="text-sm font-medium dark:text-white">
                {language === 'en' ? 'Classic Template' : 'Plantilla Clásica'}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, template: 'modern' }))}
              className={`p-4 rounded-lg border-2 ${
                formData.template === 'modern'
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
              }`}
            >
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-pink-500" />
              <div className="text-sm font-medium dark:text-white">
                {language === 'en' ? 'Modern Template' : 'Plantilla Moderna'}
              </div>
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
      {language === 'en' ? 'Back' : 'Atrás'}
    </button>
  )}

  {step < 4 ? (
    <button
      type="button"
      onClick={handleNextStep}
      className="ml-auto px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
    >
      {language === 'en' ? 'Next' : 'Siguiente'}
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
          {language === 'en' ? 'Creating...' : 'Creando...'}
        </>
      ) : (
        language === 'en' ? 'Create Card' : 'Crear Tarjeta'
      )}
    </button>
  )}
</div>


        



      </form>
    </div>
  );
}

export default CardCreator;