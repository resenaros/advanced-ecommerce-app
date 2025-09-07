// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { User, onAuthStateChanged, signOut } from "firebase/auth";

// Context value type
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Context and provider
const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
