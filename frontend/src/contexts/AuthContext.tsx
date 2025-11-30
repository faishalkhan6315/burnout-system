import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login as loginAPI,
  register as registerAPI,
  getCurrentUser,
  logout as logoutAPI,
  getToken,
} from "@/lib/api";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        if (response.success && response.data.user) {
          setUser({
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.name,
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        logoutAPI();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = (userData: { id: string; email: string; name?: string }) => {
    setUser({
      id: userData.id,
      email: userData.email,
      name: userData.name,
    });
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await loginAPI({ email, password });
      if (response.success && response.data.user) {
        handleAuthSuccess(response.data.user);
        return;
      }
      throw new Error(response.message || "Login failed");
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Login failed");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await registerAPI({ name, email, password });
      if (response.success && response.data.user) {
        handleAuthSuccess(response.data.user);
        return;
      }
      throw new Error(response.message || "Signup failed");
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Signup failed");
    }
  };

  const logout = () => {
    logoutAPI();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
