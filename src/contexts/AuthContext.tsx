import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError, AuthApiError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthError = (error: AuthError | AuthApiError) => {
    if ('code' in error) {
      switch (error.code) {
        case 'invalid_credentials':
          throw new Error(language === 'en' ? 'Invalid email or password' : 'Email o contraseña inválidos');
        case 'user_not_found':
          throw new Error(language === 'en' ? 'No account found with this email' : 'No se encontró una cuenta con este email');
        case 'email_taken':
          throw new Error(language === 'en' ? 'An account with this email already exists' : 'Ya existe una cuenta con este email');
        case 'weak_password':
          throw new Error(language === 'en' ? 'Password is too weak' : 'La contraseña es muy débil');
        default:
          throw new Error(error.message);
      }
    }
    throw error;
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        handleAuthError(error);
      }

      if (data?.user) {
        toast.success(language === 'en' ? 'Account created successfully!' : '¡Cuenta creada exitosamente!');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(language === 'en' ? 'Failed to create account' : 'Error al crear la cuenta');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        handleAuthError(error);
      }

      if (data?.user) {
        toast.success(language === 'en' ? 'Signed in successfully!' : '¡Sesión iniciada exitosamente!');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(language === 'en' ? 'Failed to sign in' : 'Error al iniciar sesión');
    }
  };

  const signOut = async () => {
    try {
      // First, check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, just clear the local state
        setUser(null);
        return;
      }

      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Only throw if it's not a session-related error
        if (!error.message.includes('session') && !error.message.includes('Session')) {
          throw error;
        }
      }
      
      // Clear the local user state
      setUser(null);
      
      toast.success(language === 'en' ? 'Signed out successfully!' : '¡Sesión cerrada exitosamente!');
    } catch (error) {
      console.error('Sign out error:', error);
      // Don't show error toast for session-related errors
      if (error instanceof Error && !error.message.toLowerCase().includes('session')) {
        toast.error(language === 'en' ? 'Error signing out' : 'Error al cerrar sesión');
      }
      // Always clear local state, even if there's an error
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}