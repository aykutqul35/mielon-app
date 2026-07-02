import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  isAdmin: boolean;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAdmin: false,
  setSession: (session) => set({ session }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  logout: () => set({ session: null, isAdmin: false }),
}));
