import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUserRole = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userId}/role`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(response.data.role);
    } catch (error) {
      console.error('Failed to fetch user role', error);
    }
  };

  const handleLogin = (userId, token) => {
    setUserId(userId);
    setToken(token);
    setIsLoggedIn(true);
    fetchUserRole(userId, token);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, token, setToken, role, isLoggedIn, setIsLoggedIn, handleLogin }}>
      {children}
    </UserContext.Provider>
  );
};
