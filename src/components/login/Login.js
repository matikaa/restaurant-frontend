// pages/login/Login.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setUserId, setToken, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/users/login', {
        email,
        password
      });

      console.log('Login successful:', response.data);
      setSuccess('You are logged in!');
      
      // Zapisujemy userId i token do kontekstu użytkownika
      setUserId(response.data.userId);
      setToken(response.data.token);
      setIsLoggedIn(true);

      // Wyświetlamy komunikat przez 2 sekundy, a potem przekierowujemy na stronę główną
      setTimeout(() => {
        navigate('/home');
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        if (error.response.status === 403) {
          setError('Invalid email or password.');
        } else if (error.response.status === 404) {
          setError('User not found.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Login</h1>
      </div>
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
