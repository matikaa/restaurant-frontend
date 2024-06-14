import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Management.css';
import { UserContext } from '../../context/UserContext';

const fetchCategories = async (token, setCategories, setCategoryPositionId) => {
  try {
    const response = await axios.get('http://localhost:8080/categories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (Array.isArray(response.data.categoryResponses)) {
      setCategories(response.data.categoryResponses);

      // Set categoryPositionId based on the maximum positionId from categories
      const maxCategoryPositionId = Math.max(...response.data.categoryResponses.map(category => category.positionId), 0);
      setCategoryPositionId(maxCategoryPositionId + 1);
    } else {
      console.error('Unexpected data format:', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

const fetchFoodForCategory = async (categoryId, token, setFoodPositionId) => {
  try {
    const response = await axios.get(`http://localhost:8080/categories/${categoryId}/food`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const { foodResponses } = response.data;
    const maxFoodPositionId = Math.max(...foodResponses.map(food => food.positionId), 0);
    setFoodPositionId(maxFoodPositionId + 1);
  } catch (error) {
    console.error('Failed to fetch food for category:', error);
  }
};

const Management = () => {
  const { token } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categoryPositionId, setCategoryPositionId] = useState('');
  const [foodPositionId, setFoodPositionId] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchCategories(token, setCategories, setCategoryPositionId);
  }, [token]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/categories', {
        positionId: categoryPositionId,
        categoryName
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage({ text: 'Category added successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      setCategoryName('');

      // Fetch updated categories
      fetchCategories(token, setCategories, setCategoryPositionId);

    } catch (error) {
      setMessage({ text: 'Failed to add category.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/categories/${selectedCategoryId}/food`, {
        positionId: foodPositionId,
        foodName,
        foodPrice
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage({ text: 'Food added successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      setFoodName('');
      setFoodPrice('');
      setFoodPositionId('');

      // Refresh food positionId for the selected category
      fetchFoodForCategory(selectedCategoryId, token, setFoodPositionId);

    } catch (error) {
      setMessage({ text: 'Failed to add food.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    fetchFoodForCategory(e.target.value, token, setFoodPositionId);
  };

  return (
    <div className="management-container">
      <h1>Management</h1>
      {message && <MessageBar message={message} />}

      <form onSubmit={handleAddCategory}>
        <h2>Add Category</h2>
        <div className="form-group">
          <label>Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Next position:</label>
          <input
            type="text"
            value={categoryPositionId}
            readOnly
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Category</button>
      </form>

      <form onSubmit={handleAddFood}>
        <h2>Add Food</h2>
        <div className="form-group">
          <label>Category:</label>
          <select
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            className="form-control"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Next position:</label>
          <input
            type="text"
            value={foodPositionId}
            readOnly
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Food Name:</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Food Price:</label>
          <input
            type="text"
            value={foodPrice}
            onChange={(e) => setFoodPrice(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Food</button>
      </form>
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

export default Management;
