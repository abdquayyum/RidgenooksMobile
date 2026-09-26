import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth token on boot
    const loadAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userStr = await AsyncStorage.getItem('currentUser');
        if (token && userStr) {
          setAuthToken(token);
          setCurrentUser(JSON.parse(userStr));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Failed to load auth", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async (token, user) => {
    setAuthToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = async () => {
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, authToken, isAuthenticated, isLoading, login, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
