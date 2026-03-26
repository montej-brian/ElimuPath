import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (_err) {
        // Not logged in or token expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    await associatePendingResult();
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    setUser(res.data.user);
    await associatePendingResult();
    return res.data;
  };

  const associatePendingResult = async () => {
    const lastResult = JSON.parse(sessionStorage.getItem('lastResult'));
    if (lastResult && lastResult.id) {
      try {
        await api.post('/api/results/associate', { resultId: lastResult.id });
      } catch (_err) {
        console.error('Failed to associate guest result:', _err);
      }
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_err) {
      console.error('Logout failed', _err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
