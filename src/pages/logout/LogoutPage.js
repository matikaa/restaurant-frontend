// pages/logout/LogoutPage.js

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { token, setUserId, setToken, setIsLoggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(true); // Dodajemy stan ładowania

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post('http://localhost:8080/users/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
        // W przypadku powodzenia wylogowanie, usuń token, userId, ustaw isLoggedIn na false i przekieruj do strony logowania
        setUserId(null);
        setToken(null);
        setIsLoggedIn(false);
        setLoading(false); // Ustawiamy ładowanie na false
        navigate('/login');
      } catch (error) {
        console.error('Failed to logout:', error);
        setLoading(false); // Ustawiamy ładowanie na false nawet w przypadku błędu
      }
    };

    logout();
  }, [token, navigate, setUserId, setToken, setIsLoggedIn]);

  if (loading) {
    return (
      <div>
        <p>Logging out...</p>
      </div>
    );
  }

  return null;
};

export default LogoutPage;
