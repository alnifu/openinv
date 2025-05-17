// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any;
  signIn: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  const signIn = async (data: any) => {
    // In a real app, you would make an API call to authenticate
    // For now, we'll just set the user
    setUser(data);
  };

  const signOut = async () => {
    // Clear user data
    setUser(null);
  };

  const value = { user, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}