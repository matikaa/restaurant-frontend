import React, { useState, useContext } from 'react';
import axios from 'axios';
import './BalancePage.css';
import { UserContext } from '../../context/UserContext'; // Importujemy kontekst użytkownika

const BalancePage = () => {
  const [money, setMoney] = useState('');
  const [message, setMessage] = useState('');
  const { userId, token, fetchBalances } = useContext(UserContext); // Pobieramy userId, token i funkcję fetchBalances z kontekstu użytkownika

  const handleMoneyChange = (e) => {
    setMoney(e.target.value);
  };

  const handleAccept = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/users/${userId}/balance`, 
        { money }, 
        { headers: { Authorization: `Bearer ${token}` } } // Przekazujemy token jako nagłówek HTTP
      );

      // Po udanym zapytaniu PUT, wywołujemy funkcję fetchBalances, aby odświeżyć saldo użytkownika
      fetchBalances();

      setMessage('Deposit successful!');  
    } catch (error) {
      if (error.response.status === 400) {
        setMessage('Wrong amount.');
      } else {
        setMessage('Deposit failed. Please try again.');
      }
    }
  };

  return (
    <div className="balance-container">
      <div className="balance-box">
        <h2>Deposit Money</h2>
        <input
          type="number"
          value={money}
          onChange={handleMoneyChange}
          placeholder="Enter money"
          className="balance-input"
        />
        <button onClick={handleAccept} className="balance-button">Accept</button>
        {message && <p className="balance-message">{message}</p>}
      </div>
    </div>
  );
};

export default BalancePage;
