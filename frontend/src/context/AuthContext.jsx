import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');
    
    if (token && userData && loginTime) {
      // Check if login is still valid (7 days = 604800000 milliseconds)
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      const currentTime = new Date().getTime();
      const timeSinceLogin = currentTime - parseInt(loginTime);
      
      if (timeSinceLogin < sevenDaysInMs) {
        // Login is still valid
        console.log('Auto-login: Session valid');
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        // Login expired, clear storage
        console.log('Auto-login: Session expired');
        clearAuth();
      }
    } else {
      console.log('Auto-login: No saved session');
    }
    setLoading(false);
  };

  const login = (userData, token) => {
    const loginTime = new Date().getTime().toString();
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('loginTime', loginTime);
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    
    console.log('Login successful:', userData.email);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const logout = () => {
    console.log('Logging out');
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
