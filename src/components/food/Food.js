import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Food.css';

const Food = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/categories');
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError('Failed to fetch categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="food-container">
      <h1>Food Categories</h1>
      {error && <p className="error">{error}</p>}
      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;
