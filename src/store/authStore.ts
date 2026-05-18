import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AppRole = 'admin' | 'restaurant' | 'driver' | 'customer' | null;

interface AuthState {
  user: User | null;
  role: AppRole;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, role: AppRole, isSignUp?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  profile: null,
  isLoading: true,
  signIn: async (email: string, role: AppRole, isSignUp: boolean = false) => {
    try {
      const password = 'password123!';
      let authData;
      
      if (email.includes('demo')) {
        // Mock login for demo accounts to avoid "Failed to fetch" if Supabase isn't configured
        const mockUser = {
          id: `mock-${role}-123`,
          email,
          user_metadata: { role }
        } as any;
        set({ user: mockUser, role: role, isLoading: false, profile: { role } });
        return { error: null };
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        authData = data;
        
        // Ensure user is in our public.users table with the correct role
        if (authData.user) {
           await supabase.from('users').upsert({ id: authData.user.id, email, role }, { onConflict: 'id' });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error && error.message.includes('Invalid login credentials')) {
          // For demo purposes: Auto create account if it doesn't exist when they try to sign in
          const res = await supabase.auth.signUp({
            email,
            password,
          });
          if (res.error && res.error.message.includes('Email not confirmed')) {
            throw new Error('Email not confirmed. Please delete this user from your Supabase dashboard (Authentication -> Users) and try again, OR disable "Confirm email" in Authentication -> Providers -> Email.');
          } else if (res.error) {
            throw error; // Original error if sign up fails
          }
          authData = res.data;
          if (authData.user) {
             await supabase.from('users').upsert({ id: authData.user.id, email, role }, { onConflict: 'id' });
          }
        } else if (error && error.message.includes('Email not confirmed')) {
          throw new Error('Email not confirmed. Please delete this user from your Supabase dashboard (Authentication -> Users) and try again, OR disable "Confirm email" in Authentication -> Providers -> Email.');
        } else if (error) {
          throw error;
        } else {
          authData = data;
        }
      }
      
      // Note: If email confirmation is enabled in Supabase, session might be null here.
      if (!authData.session && authData.user) {
        return { error: new Error('Please check your email to confirm your account before signing in. (Or disable Email Confirmations in Supabase Dashboard -> Authentication -> Providers -> Email)') };
      }
      
      const { data: profile } = await supabase.from('users').select('*').eq('id', authData.user?.id).single();
      
      set({ user: authData.user, role: profile?.role || role, isLoading: false, profile });
      return { error: null };
    } catch(err: any) {
      console.error(err);
      if (err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        console.warn("Supabase not configured or unreachable, falling back to mock login.");
        const mockUser = {
          id: `mock-${role}-fallback`,
          email,
          user_metadata: { role }
        } as any;
        set({ user: mockUser, role: role, isLoading: false, profile: { role } });
        return { error: null };
      }
      return { error: err as Error };
    }
  },
  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signout failed, ignoring network error if offline.");
    }
    set({ user: null, role: null, profile: null });
  },
  checkUser: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (session?.user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single();
        set({ user: session.user, role: profile?.role || 'restaurant', profile, isLoading: false });
      } else {
        set({ user: null, role: null, profile: null, isLoading: false });
      }
    } catch (err) {
      console.warn("Failed to fetch session. Assuming user is not logged in.", err);
      set({ isLoading: false, user: null, role: null, profile: null });
    }
  },
}));
