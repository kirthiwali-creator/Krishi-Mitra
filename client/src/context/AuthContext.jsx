import { useEffect, useState } from 'react';
import api from '../api';
import AuthContext from './authContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('km_token')));

  useEffect(() => {
    if (!localStorage.getItem('km_token')) return undefined;
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('km_token'))
      .finally(() => setLoading(false));
    return undefined;
  }, []);

  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener('km-logout', onLogout);
    return () => window.removeEventListener('km-logout', onLogout);
  }, []);

  const login = (data) => {
    localStorage.setItem('km_token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('km_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
