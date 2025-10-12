'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Types for future Google authentication
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'local';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  // Future methods we might need
  // syncBillsToCloud: () => Promise<void>;
  // loadBillsFromCloud: () => Promise<Bill[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // For now, we're using local storage, but this will be replaced with Google Auth
  const isAuthenticated = false; // Will be: !!user

  const signInWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth
      // const response = await signInWithPopup(auth, googleProvider);
      // const user = response.user;
      // setUser({
      //   id: user.uid,
      //   email: user.email!,
      //   name: user.displayName!,
      //   picture: user.photoURL || undefined,
      //   provider: 'google'
      // });
      console.log('Google sign-in not implemented yet');
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Implement sign out
      // await signOutFromFirebase(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        signInWithGoogle,
        signOut,
      }}
    >
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

// Helper function for future use
export const isUserPremium = (user: User | null): boolean => {
  // Future: Check if user has premium subscription
  return false;
};

// Future configuration for Google OAuth
export const AUTH_CONFIG = {
  google: {
    // clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    // Add other config as needed
  },
  features: {
    cloudSync: false, // Will be enabled when auth is implemented
    multiDevice: false,
    sharedBills: false, // Future feature
  },
} as const;