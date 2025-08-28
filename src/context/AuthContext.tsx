import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  name: string;
  role: "builder" | "subcontractor" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Secure storage utility
const secureStorage = {
  setItem: (key: string, value: string, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(key, value);
  },
  getItem: (key: string) => {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = secureStorage.getItem(TOKEN_KEY);
        const userData = secureStorage.getItem(USER_KEY);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear corrupted data
        secureStorage.removeItem(TOKEN_KEY);
        secureStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User, rememberMe = false) => {
    // Generate a mock JWT token (replace with real token from API)
    const token = `mock_jwt_${userData.id}_${Date.now()}`;
    
    // Store auth data
    secureStorage.setItem(TOKEN_KEY, token, rememberMe);
    secureStorage.setItem(USER_KEY, JSON.stringify(userData), rememberMe);
    
    setUser(userData);
  };

  const logout = () => {
    secureStorage.removeItem(TOKEN_KEY);
    secureStorage.removeItem(USER_KEY);
    setUser(null);
    navigate('/login'); // ✅ Fixed: Navigate to /login instead of /signin
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
