import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Dodajemy isLoggedIn do stanu kontekstu

  return (
    <UserContext.Provider value={{ userId, setUserId, token, setToken, isLoggedIn, setIsLoggedIn }}> {/* Dodajemy isLoggedIn do wartości kontekstu */}
      {children}
    </UserContext.Provider>
  );
};
