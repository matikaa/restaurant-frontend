import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import './User.css';

const User = () => {
  const { userId, token } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response || !response.data) {
          throw new Error('Invalid response from server');
        }

        setUsers(response.data.userResponses);
        setError('');
      } catch (error) {
        setError('Failed to fetch users. Please try again.');
      }
    };

    fetchUsers();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:8080/users/${userId}/delete`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsers(users.filter(user => user.userId !== userId));
    } catch (error) {
      setError('Failed to delete user. Please try again.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="user-container">
      <h2>Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Created Time</th>
            <th>Role</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Money</th>
            <th>Loyalty Card</th>
            <th>Action</th> {}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.createdTime}</td>
              <td>{user.role}</td>
              <td>{user.address}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.money}</td>
              <td>{user.loyaltyCard ? 'Yes' : 'No'}</td>
              <td>
                {user.role !== 'ADMIN' ? (
                  <button className="delete-button" onClick={() => handleDeleteUser(user.userId)}>
                    Delete
                  </button>
                ) : (
                  <span className="no-delete">None</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
