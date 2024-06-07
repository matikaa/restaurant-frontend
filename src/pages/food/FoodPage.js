import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './FoodPage.css';
import { UserContext } from '../../context/UserContext'; // Importujemy kontekst użytkownika

const FoodPage = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null);
  const { token } = useContext(UserContext); // Pobieramy token z kontekstu użytkownika

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/categories', {
          headers: { Authorization: `Bearer ${token}` } // Przekazujemy token jako nagłówek HTTP
        });
        if (response.data && Array.isArray(response.data.categoryResponses)) {
          const sortedCategories = response.data.categoryResponses.sort((a, b) => a.positionId - b.positionId);
          setCategories(sortedCategories);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError('Failed to fetch categories. Please try again.');
      }
    };

    fetchCategories();
  }, [token]);

  const handleAddToOrder = async (categoryId, foodId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/categories/${categoryId}/food/${foodId}/order`,
        null,
        { headers: { Authorization: `Bearer ${token}` } } // Przekazujemy token jako nagłówek HTTP
      );
      console.log('Add to order successful:', response.data);
      setMessage({ text: 'Food added to order successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000); // Usunięcie komunikatu po 5 sekundach
    } catch (error) {
      console.error('Add to order error:', error);
      setMessage({ text: 'Failed to add food to order. Not enough money.', type: 'error' });
      setTimeout(() => setMessage(null), 3000); // Usunięcie komunikatu po 5 sekundach
    }
  };

  return (
    <div className="food-container">
      <h1>Food Categories</h1>
      {error && <p className="error">{error}</p>}
      {message && <MessageBar message={message} />}
      <div className="categories-list">
        {categories.map((category) => (
          <CategoryCard key={category.categoryId} category={category} handleAddToOrder={handleAddToOrder} />
        ))}
      </div>
    </div>
  );
};

const CategoryCard = ({ category, handleAddToOrder }) => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/categories/${category.categoryId}/food`);
        if (response.data && Array.isArray(response.data.foodResponses)) {
          const sortedFoods = response.data.foodResponses.sort((a, b) => a.positionId - b.positionId);
          setFoods(sortedFoods);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(`Failed to fetch foods for category ${category.categoryName}. Please try again.`);
      }
    };

    fetchFoods();
  }, [category.categoryId, category.categoryName]);

  return (
    <div className="category-card">
      <h2>{category.categoryName}</h2>
      {error && <p className="error">{error}</p>}
      <div className="foods-list">
        {foods.map((food) => (
          <div key={food.foodId} className="food-item">
            <span>{food.foodName}</span>
            <span className="food-price">${food.foodPrice.toFixed(2)}</span>
            <button className="add-button" onClick={() => handleAddToOrder(category.categoryId, food.foodId)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const MessageBar = ({ message }) => {
  const messageStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px',
    borderRadius: '5px',
    color: message.type === 'success' ? 'green' : 'red',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Usunięcie komunikatu po 5 sekundach
    }, 3000);

    return () => clearTimeout(timer); // Zabezpieczenie przed wyciekiem pamięci
  }, [message]);

  return (
    <div style={messageStyle}>
      {message.text}
    </div>
  );
};

export default FoodPage;