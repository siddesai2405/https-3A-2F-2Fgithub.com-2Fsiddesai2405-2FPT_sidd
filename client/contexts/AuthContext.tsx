import React, { createContext, useContext, useState, useEffect } from "react";
import { User, clearSession, getCurrentUser, setCurrentUser } from "../lib/db";
import { loginUser, registerUser } from "../lib/auth";
import { initializeDatabase } from "../lib/db-init";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Initialize database with demo data if needed
        await initializeDatabase();

        const currentUser = await getCurrentUser();
        setUser(currentUser || null);
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const loginUser_ = await loginUser(email, password);
    await setCurrentUser(loginUser_.id!);
    setUser(loginUser_);
  };

  const register = async (name: string, email: string, password: string) => {
    const newUser = await registerUser(name, email, password, "user");
    await setCurrentUser(newUser.id!);
    setUser(newUser);
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
