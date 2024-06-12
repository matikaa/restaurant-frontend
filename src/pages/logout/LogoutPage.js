import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { token, setUserId, setToken, setIsLoggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post('http://localhost:8080/users/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
        
        setUserId(null);
        setToken(null);
        setIsLoggedIn(false);
        setLoading(false);
        navigate('/login');
      } catch (error) {
        console.error('Failed to logout:', error);
        setLoading(false);
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
