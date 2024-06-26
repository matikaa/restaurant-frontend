import React, { useState, useContext } from 'react';
import axios from 'axios';
import './Balance.css';
import { UserContext } from '../../context/UserContext';
import { BalanceContext } from '../../context/BalanceContext';

const Balance = () => {
  const [money, setMoney] = useState('');
  const [message, setMessage] = useState('');
  const { userId, token } = useContext(UserContext);
  const { setBalance } = useContext(BalanceContext);

  const handleMoneyChange = (e) => {
    setMoney(e.target.value);
  };

  const handleAccept = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/users/${userId}/balance`,
        { money },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response || !response.status) {
        throw new Error('Invalid response from server');
      }

      const balanceResponse = await axios.get(`http://localhost:8080/users/${userId}/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!balanceResponse || !balanceResponse.data) {
          throw new Error('Invalid response from server');
        }

      setBalance(balanceResponse.data.money)

      setMessage('Deposit successful!');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error response:', error.response);

      if (error.response && error.response.status === 400) {
        setMessage('Wrong amount.');
      } else {
        setMessage('Deposit failed. Please try again.');
      }

      setTimeout(() => setMessage(null), 3000);
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

export default Balance;
