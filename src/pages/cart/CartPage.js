import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './CartPage.css';
import { UserContext } from '../../context/UserContext';
import { CartContext } from '../../context/CartContext';

const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null); // Komunikat ogólny
  const { userId, token } = useContext(UserContext);
  const { setCartBalance } = useContext(CartContext);

  const fetchCartData = async () => {
    try {
      if (!userId || !token) {
        throw new Error('Please log in to view your cart.');
      }

      const response = await axios.get(`http://localhost:8080/users/${userId}/cart/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      setCartData(response.data);
      setCartBalance(response.data.cartValue);
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('Your cart is empty. Move to Food to place an order.');
      } else {
        setError(error.message);
      }
      setCartData(null);
      setCartBalance(0);
    }
  };

  const fetchFoodIdAndCategoryId = async (foodName, foodPrice) => {
    try {
      const FoodNameAndPrice = { foodName, foodPrice };
      const response = await axios.post(
        `http://localhost:8080/categories/food`,
        FoodNameAndPrice,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      const categoryId = response.data.categoryId;
      const foodId = response.data.foodId;

      await axios.post(
        `http://localhost:8080/categories/${categoryId}/food/${foodId}/order`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCartData();
      setMessage('Food deleted successfully!'); // Ustawienie komunikatu o usunięciu dania
      setTimeout(() => setMessage(null), 3000); // Usunięcie komunikatu po 3 sekundach
    } catch (error) {
      setError('Failed to delete food from cart. Please try again.');
    }
  };

  const handleCompleteOrder = async () => {
    try {
      await axios.put(`http://localhost:8080/users/${userId}/cart/order`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Order completed successfully!');
      fetchCartData(); // Odświeżanie koszyka po złożeniu zamówienia
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setError('Failed to complete order. Please try again.');
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [userId, token]);

  return (
    <div className="cart-container">
      <h2>Cart Details</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        cartData && (
          <div className="cart-details">
            <p>Cart Value: ${cartData.cartValue.toFixed(2)}</p>
            <div className="food-list">
              <h3>Food Items:</h3>
              {cartData.food.map((food, index) => (
                <div key={index} className="cart-item">
                  <span className="cart-food-name">{food}</span>
                  <span className="cart-food-price">${cartData.foodPrice[index].toFixed(2)}</span>
                  <button
                    className="cart-delete-button"
                    onClick={() => fetchFoodIdAndCategoryId(food, cartData.foodPrice[index])}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button className="complete-order-button" onClick={handleCompleteOrder}>
              Complete Order
            </button>
          </div>
        )
      )}
      {message && (
        <div className="message-bar success-message">
          <p style={{ color: 'green' }}>{message}</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
