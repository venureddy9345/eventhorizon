import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when app loads
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    
    // Save to LocalStorage (Browser Memory)
    localStorage.setItem('token', data.token);
    localStorage.setItem('userInfo', JSON.stringify(data));
    
    setUser(data);
    return data; 
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Register Function
  const register = async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  return (
    // FIX: Added 'setUser' here so other pages can update the user data locally
    <AuthContext.Provider value={{ user, setUser, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;