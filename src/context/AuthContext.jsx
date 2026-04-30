/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setToken(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Decode JWT payload (simple base64 decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.sub || payload.nameid,
          email: payload.email,
          username: payload.unique_name || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
          role: payload.Role || payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || "User"
        });
      } catch (e) {
        console.error("Invalid token", e);
        logout();
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  }, [token, logout]);

  const login = async (email, password, options = {}) => {
    const { redirect = true } = options;

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token } = response.data;
      setToken(token);
      
      // Decode to check role for redirect
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.Role || payload.role || "User";
      
      if (redirect) {
        if (role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      await axiosInstance.post('/auth/register', { username, email, password });
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
