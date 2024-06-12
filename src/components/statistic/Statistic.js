import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import './Statistic.css';

const StatisticPage = () => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const { role, token } = useContext(UserContext);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:8080/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatistics(response.data);
      } catch (error) {
        setError('Failed to fetch statistics. Please try again.');
      }
    };

    if (role === 'ADMIN') {
      fetchStatistics();
    }
  }, [role, token]);

  if (role !== 'ADMIN') {
    return <p>You do not have permission to view this page.</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!statistics) {
    return <p>Loading statistics...</p>;
  }

  if (!statistics.soldFoodSummaries.length) {
    return <p>This card is empty.</p>;
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortStatistics = (stats) => {
    if (!sortBy) return stats;
    return [...stats].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      if (valueA === valueB) return 0;
      return sortOrder === 'asc' ? (valueA < valueB ? -1 : 1) : valueA > valueB ? -1 : 1;
    });
  };

  const groupedByCategory = statistics.soldFoodSummaries.reduce((acc, item) => {
    if (!acc[item.categoryName]) {
      acc[item.categoryName] = { items: [], totalValue: 0 };
    }
    acc[item.categoryName].items.push(item);
    acc[item.categoryName].totalValue += item.totalValue;
    return acc;
  }, {});

  return (
    <div className="statistics-container">
      <h2>Statistics</h2>
      <div className="sort-container">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="">None</option>
          <option value="foodName">Food Name</option>
          <option value="price">Price</option>
          <option value="quantitySold">Quantity Sold</option>
          <option value="totalValue">Total Value</option>
        </select>
        <div>
          <button onClick={() => setSortOrder('asc')}>Ascending</button>
          <button onClick={() => setSortOrder('desc')}>Descending</button>
        </div>
      </div>
      <p>Total Value of Orders: ${statistics.value.toFixed(2)}</p>
      {Object.entries(groupedByCategory).map(([categoryName, categoryData]) => (
        <div key={categoryName}>
          <h3>{categoryName}</h3>
          <p>Total value of {categoryName}: ${categoryData.totalValue.toFixed(2)}</p>
          <table>
            <thead>
              <tr>
                <th className="food-name">Food Name</th>
                <th className="price">Price</th>
                <th className="quantity-sold">Quantity Sold</th>
                <th className="total-value">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {sortStatistics(categoryData.items).map((food) => (
                <tr key={food.positionId}>
                  <td className="food-name">{food.foodName}</td>
                  <td className="price">{food.price.toFixed(2)}</td>
                  <td className="quantity-sold">{food.quantitySold}</td>
                  <td className="total-value">{food.totalValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default StatisticPage;
