import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('indialens_token');
    const storedUser = localStorage.getItem('indialens_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('indialens_token');
        localStorage.removeItem('indialens_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    const { token: t, user } = res.data.data;
    localStorage.setItem('indialens_token', t);
    localStorage.setItem('indialens_user', JSON.stringify(user));
    setToken(t);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('indialens_token');
    localStorage.removeItem('indialens_user');
    setToken(null);
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
