import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Food.css';
import { UserContext } from '../../context/UserContext';
import { CartContext } from '../../context/CartContext';

const Food = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null);
  const { token, userId, role, isLoggedIn } = useContext(UserContext);
  const { setCartBalance } = useContext(CartContext);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/categories');
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddToOrder = async (categoryId, foodId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/categories/${categoryId}/food/${foodId}/order`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response || !response.status) {
        throw new Error('Invalid response from server');
      }

      const cartResponse = await axios.get(`http://localhost:8080/users/${userId}/cart/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!cartResponse || !cartResponse.status) {
        throw new Error('Invalid response from server');
      }

      setCartBalance(cartResponse.data.cartValue);

      setMessage({ text: 'Food added to order successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Add to order error:', error);

      if (error.response && error.response.data) {
        setMessage({ text: error.response.data.message || 'Failed to add food to order. Not enough money.', type: 'error' });
      } else {
        setMessage({ text: 'Failed to add food to order. Please try again.', type: 'error' });
      }

      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/categories/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response || !response.status) {
        throw new Error('Invalid response from server');
      }

      setMessage({ text: 'Category deleted successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);

      fetchCategories();

    } catch (error) {
      console.error('Delete category error:', error);
      setMessage({ text: 'Failed to delete category. Please try again.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEditCategory = async (categoryId, updatedCategoryData) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/categories/${categoryId}`,
        updatedCategoryData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response || !response.status) {
        throw new Error('Invalid response from server');
      }

      setMessage({ text: 'Category updated successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);

      fetchCategories();

    } catch (error) {
      console.error('Edit category error:', error);
      setMessage({ text: 'Failed to update category. Please try again.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="food-container">
      <h1>Food Categories</h1>
      {error && <p className="error">{error}</p>}
      {message && <MessageBar message={message} />}
      <div className="categories-list">
        {categories.map((category) => (
          <CategoryCard
            key={category.categoryId}
            category={category}
            handleAddToOrder={handleAddToOrder}
            handleDeleteCategory={handleDeleteCategory}
            handleEditCategory={handleEditCategory}
            role={role}
            isLoggedIn={isLoggedIn}
            token={token}
            setMessage={setMessage}
          />
        ))}
      </div>
    </div>
  );
};

const CategoryCard = ({ category, handleAddToOrder, handleDeleteCategory, handleEditCategory, role, isLoggedIn, token, setMessage }) => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category.categoryName);

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

  useEffect(() => {
    fetchFoods();
  }, [category.categoryId]);

  const handleCategoryEdit = () => {
    setIsEditing(true);
  };

  const handleCategoryEditSubmit = () => {
    handleEditCategory(category.categoryId, { categoryName: newCategoryName, positionId: category.positionId });
    setIsEditing(false);
  };

  return (
    <div className="category-card">
      {isEditing ? (
        <div className="category-edit">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button className="save-button" onClick={handleCategoryEditSubmit}>Save</button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <h2>{category.categoryName}</h2>
          <div className="category-actions">
            {isLoggedIn && role === 'ADMIN' && (
              <>
                <button className="edit-button" onClick={handleCategoryEdit}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteCategory(category.categoryId)}>Delete</button>
              </>
            )}
          </div>
        </>
      )}
      {error && <p className="error">{error}</p>}
      <div className="foods-list">
        {foods.map((food) => (
          <FoodItem
            key={food.foodId}
            category={category}
            food={food}
            handleAddToOrder={handleAddToOrder}
            role={role}
            isLoggedIn={isLoggedIn}
            token={token}
            fetchFoods={fetchFoods}
            setMessage={setMessage}
          />
        ))}
      </div>
    </div>
  );
};

const FoodItem = ({ category, food, handleAddToOrder, role, isLoggedIn, token, fetchFoods, setMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [foodName, setFoodName] = useState(food.foodName);
  const [foodPrice, setFoodPrice] = useState(food.foodPrice);

  const handleEditFood = async () => {
    try {
      const foodRequestUpdate = {
        categoryId: category.categoryId,
        positionId: food.positionId,
        foodName: foodName,
        foodPrice: foodPrice
      };

      const response = await axios.put(
        `http://localhost:8080/categories/${category.categoryId}/food/${food.foodId}`,
        foodRequestUpdate,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response || !response.status) {
        throw new Error('Invalid response from server');
      }

      setIsEditing(false);
      setMessage({ text: 'Food updated successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);

      fetchFoods();

    } catch (error) {
      console.error('Edit food error:', error);
      setMessage({ text: 'Failed to update food. Please try again.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteFood = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/categories/${category.categoryId}/food/${food.foodId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response || !response.status) {
        throw new Error('Invalid response from server');
      }

      setMessage({ text: 'Food deleted successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);

      fetchFoods();

    } catch (error) {
      console.error('Delete food error:', error);
      setMessage({ text: 'Failed to delete food. Please try again.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="food-item">
      {isEditing ? (
        <>
          <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
          <input type="number" value={foodPrice} onChange={(e) => setFoodPrice(e.target.value)} />
          <button className="edit-button" onClick={handleEditFood}>Save</button>
          <button className="edit-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{food.foodName}</span>
          <span className="food-price">${food.foodPrice.toFixed(2)}</span>
          {isLoggedIn && (
            role === 'ADMIN' ? (
              <>
                <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                <button className="edit-button delete-button" onClick={handleDeleteFood}>Delete</button>
              </>
            ) : (
              <button className="add-button" onClick={() => handleAddToOrder(category.categoryId, food.foodId)}>Add</button>
            )
          )}
        </>
      )}
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
    const timer = setTimeout(() => {}, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div style={messageStyle}>
      {message.text}
    </div>
  );
};

export default Food;
