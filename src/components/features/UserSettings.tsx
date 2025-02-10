import React, { useEffect, useState } from 'react';
import { User, Settings, Heart, Loader2, Camera, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface FavoriteCard {
  id: string;
  recipient_name: string;
  message: string;
  background_image: string;
  created_at: string;
}

export default function UserSettings() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<FavoriteCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchFavorites();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // First try to fetch existing profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: '',
              avatar_url: '',
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        profile = newProfile;
      } else if (error) {
        throw error;
      }

      if (profile) {
        setProfile(profile);
        setFormData({
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(
        language === 'en'
          ? 'Failed to load profile'
          : 'Error al cargar el perfil'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('card_favorites')
        .select(`
          card_id,
          valentine_cards (
            id,
            recipient_name,
            message,
            background_image,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        setFavorites(data.map(f => f.valentine_cards).filter(Boolean) as FavoriteCard[]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error(
        language === 'en'
          ? 'Failed to load favorites'
          : 'Error al cargar favoritos'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(
        language === 'en'
          ? 'Profile updated successfully'
          : 'Perfil actualizado exitosamente'
      );
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(
        language === 'en'
          ? 'Failed to update profile'
          : 'Error al actualizar el perfil'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const removeFavorite = async (cardId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('card_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('card_id', cardId);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== cardId));
      toast.success(
        language === 'en'
          ? 'Removed from favorites'
          : 'Eliminado de favoritos'
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error(
        language === 'en'
          ? 'Failed to remove from favorites'
          : 'Error al eliminar de favoritos'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6 text-pink-500" />
          {language === 'en' ? 'Account Settings' : 'Configuración de la Cuenta'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-pink-500" />
            {language === 'en' ? 'Profile Information' : 'Información del Perfil'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'en' ? 'Full Name' : 'Nombre Completo'}
              </label>
              <input
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'en' ? 'Avatar URL' : 'URL del Avatar'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400"
                  title={language === 'en' ? 'Upload Avatar' : 'Subir Avatar'}
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Save Changes' : 'Guardar Cambios'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Favorite Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            {language === 'en' ? 'Favorite Cards' : 'Tarjetas Favoritas'}
          </h3>

          {favorites.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              {language === 'en' 
                ? 'No favorite cards yet'
                : 'Aún no hay tarjetas favoritas'}
            </p>
          ) : (
            <div className="space-y-4">
              {favorites.map((card) => (
                <div
                  key={card.id}
                  className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div
                    className="aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.background_image})` }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => removeFavorite(card.id)}
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {language === 'en' ? 'To' : 'Para'}: {card.recipient_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {card.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}