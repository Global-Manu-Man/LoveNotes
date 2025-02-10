import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { AuthError, AuthApiError } from '@supabase/supabase-js';

export const handleAuthError = (error: AuthError | AuthApiError, language: string) => {
  // ... existing handleAuthError code ...
};

export const signInUser = async (email: string, password: string) => {
  // ... existing signIn code ...
};

export const signUpUser = async (email: string, password: string) => {
  // ... existing signUp code ...
};

export const signOutUser = async () => {
  // ... existing signOut code ...
}; 