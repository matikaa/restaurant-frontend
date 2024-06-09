import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import { BalanceContext } from '../context/BalanceContext';

const UserBalances = () => {
  const { token, userId } = useContext(UserContext);
  const { cartBalance, setCartBalance } = useContext(CartContext);
  const { balance, setBalance } = useContext(BalanceContext);
  const location = useLocation();

  useEffect(() => {
    const fetchBalances = async () => {
      if (token && userId) {
        try {
          const balanceResponse = await axios.get(`http://localhost:8080/users/${userId}/balance`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!balanceResponse || !balanceResponse.data) {
            throw new Error('Invalid response from server');
          }

          setBalance(balanceResponse.data.money);

          const cartResponse = await axios.get(`http://localhost:8080/users/${userId}/cart/order`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!cartResponse || !cartResponse.data) {
            throw new Error('Invalid response from server');
          }

          setCartBalance(cartResponse.data.cartValue);
        } catch (error) {
          console.error('Failed to fetch balances:', error);
        }
      } else {
        setBalance(0);
        setCartBalance(0);
      }
    };

    fetchBalances();
  }, [token, userId, location.pathname, setCartBalance]);

  return (
    <div className="user-balances">
      <div><strong>Delivery price - $10</strong></div>
      <div>Balance: ${balance && balance.toFixed(2)}</div>
      <div>Cart Balance: ${cartBalance && cartBalance.toFixed(2)}</div>
    </div>
  );
};

export default UserBalances;
