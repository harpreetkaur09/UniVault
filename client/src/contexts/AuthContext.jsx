import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/teacher");

  useEffect(() => {
    localStorage.removeItem("portfolio_token");
    localStorage.removeItem("univault_token");
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await authService.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminRoute) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [isAdminRoute, checkAuth]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(checkAuth, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, checkAuth]);

  const login = useCallback(async (email, password) => {
    const { data } = await authService.login(email, password);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* cookie cleared server-side; proceed regardless */
    }
    setUser(null);
    navigate("/admin/login");
  }, [navigate]);

  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";

  const value = useMemo(
    () => ({ user, loading, login, logout, isAdmin, isTeacher }),
    [user, loading, login, logout, isAdmin, isTeacher]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
