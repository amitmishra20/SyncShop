import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

function normalizeRole(role) {
  if (!role) return '';
  if (role === 'ROLE_ADMIN') return 'ADMIN';
  if (role === 'ROLE_CUSTOMER') return 'CUSTOMER';
  return role;
}

function buildSessionUser(data, fallbackEmail) {
  const email = data?.email || fallbackEmail || '';
  const name =
    data?.name?.trim() ||
    (email ? email.split('@')[0] : 'User');

  return {
    id: data?.id ?? null,
    email,
    name,
    role: normalizeRole(data?.role),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      const token = response?.data?.token;
      if (!token) {
        throw new Error('Authentication token not received from server.');
      }

      const sessionUser = buildSessionUser(response.data, email);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      setUser(sessionUser);

      return sessionUser;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed';
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
      });
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed';
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updateStoredUser = useCallback((partialUserData) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...partialUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateStoredUser,
      isAuthenticated,
      isAdmin,
    }),
    [user, loading, login, register, logout, updateStoredUser, isAuthenticated, isAdmin]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}