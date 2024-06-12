import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import './Order.css';

const Order = () => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { userId, token } = useContext(UserContext);

  const fetchCurrentOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userId}/cart/order_in_delivery`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      setCurrentOrder(response.data);
      setError('');
    } catch (error) {
      setCurrentOrder(null);
    }
  };

  const confirmDelivery = async () => {
    try {
      await axios.post(
        `http://localhost:8080/users/${userId}/cart/order`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Order confirmed as delivered!');
      fetchCurrentOrder();
      fetchPastOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Failed to confirm delivery. Please try again.');
    }
  };

  const fetchPastOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userId}/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      setPastOrders(response.data.cartResponses || []);
      setError('');
    } catch (error) {
      setError('Failed to fetch past orders.');
      setPastOrders([]);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();
    fetchPastOrders();
  }, [userId, token]);

  return (
    <div className="order-container">
      <h2>Current Order</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="message" style={{ color: 'green' }}>{message}</p>}
      {currentOrder ? (
        <div className="current-order">
          <p>Cart Value: ${currentOrder.cartValue.toFixed(2)}</p>
          <div className="food-list">
            <h3>Food Items:</h3>
            {currentOrder.food.map((food, index) => (
              <div key={index} className="order-item">
                <span className="order-food-name">{food}</span>
                <span className="order-food-price">${currentOrder.foodPrice[index].toFixed(2)}</span>
              </div>
            ))}
          </div>
          <button className="confirm-delivery-button" onClick={confirmDelivery}>
            Confirm Delivery
          </button>
        </div>
      ) : (
        <p>No current order.</p>
      )}

      <h2>Past Orders</h2>
      {pastOrders.length > 0 ? (
        <div className="past-orders">
          {pastOrders.map((order, index) => (
            <div key={index} className="past-order">
              <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
              <p>Cart Value: ${order.cartValue.toFixed(2)}</p>
              <div className="food-list">
                <h3>Food Items:</h3>
                {order.food.map((food, foodIndex) => (
                  <div key={foodIndex} className="order-item">
                    <span className="order-food-name">{food}</span>
                    <span className="order-food-price">${order.foodPrice[foodIndex].toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No past orders.</p>
      )}
    </div>
  );
};

export default Order;
