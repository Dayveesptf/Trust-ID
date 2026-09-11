import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getAuthToken } from "../services/api";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  type LoginPayload,
  type RegisterPayload,
  type User,
} from "../services/authService";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);

      return currentUser;
    } catch {
      logoutUser();
      setUser(null);

      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser]);

  const login = async (payload: LoginPayload) => {
    const response = await loginUser(payload);

    setUser(response.user);

    return response.user;
  };

  const register = async (payload: RegisterPayload) => {
    const response = await registerUser(payload);

    setUser(response.user);

    return response.user;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}