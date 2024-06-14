import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import './Me.css'; // Import stylów CSS
import { useNavigate } from 'react-router-dom';

const Me = () => {
  const { setUserId, userId, token, setIsLoggedIn, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response || !response.data) {
          throw new Error('Invalid response from server');
        }

        setUserData(response.data);
        setEditName(response.data.name);
        setEditAddress(response.data.address);
        setEditPhoneNumber(response.data.phoneNumber);
        setError('');
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError('Failed to fetch user data. Please try again.');
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleEdit = async () => {
    try {
      const updateUserRequest = {
        name: editName,
        address: editAddress,
        phoneNumber: editPhoneNumber,
      };

      const response = await axios.put('http://localhost:8080/users/me', updateUserRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      setUserData(response.data);
      setMessage({ text: 'User details updated successfully.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      setError('');
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user details:", error);
      setMessage({ text: 'Failed to update user details. Please try again.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    try {

      const passwordRequest = {
          password: password
        };

      const response = await axios.post('http://localhost:8080/users/me', passwordRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response) {
        throw new Error('Invalid response from server');
      }

      setMessage({ text: 'Account deleted successfully.', type: 'success' });

      setUserId(null);
      setToken(null);
      setIsLoggedIn(false);
      navigate('/home');
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage({ text: 'Failed to delete account. Please check your password and try again.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const changePasswordRequest = {
        currentPassword: password,
        newPassword: newPassword,
      };

      const response = await axios.put('http://localhost:8080/users/me/password', changePasswordRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response) {
        throw new Error('Invalid response from server');
      }

      setMessage({ text: 'Password changed successfully.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ text: 'Failed to change password. Please check your credentials and try again.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditName(userData.name);
      setEditAddress(userData.address);
      setEditPhoneNumber(userData.phoneNumber);
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setPassword('');
  };

  const togglePasswordMode = () => {
    setPasswordMode(!passwordMode);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setEditName(value);
    } else if (name === 'address') {
      setEditAddress(value);
    } else if (name === 'phoneNumber') {
      setEditPhoneNumber(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
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
      zIndex: '1000',
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

  return (
    <div className="me-container">
      <h2>My Profile</h2>
      {userData ? (
        <div className="user-details">
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <p><strong>Address:</strong> {userData.address}</p>
          <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
          <p><strong>Money:</strong> {userData.money}</p>
          <p><strong>Loyalty Card:</strong> {userData.loyaltyCard ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="actions">
        <button className="blue-button" onClick={toggleEditMode}>Edit</button>
        <button className="blue-button" onClick={toggleDeleteMode}>Delete Account</button>
        <button className="blue-button" onClick={togglePasswordMode}>Change Password</button>
      </div>
      {passwordMode && (
        <div className="change-password-form">
          <h3>Change Password</h3>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password:</label>
            <input type="password" id="currentPassword" name="password" value={password} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleInputChange} />
          </div>
          <div className="actions">
            <button className="blue-button" onClick={handleChangePassword}>Change Password</button>
            <button className="blue-button" onClick={() => setPasswordMode(false)}>Cancel</button>
          </div>
        </div>
      )}
      {deleteMode && (
        <div className="delete-form">
          <h3>Confirm Account Deletion</h3>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={handleInputChange} />
          </div>
          <div className="actions">
            <button className="blue-button" onClick={handleDeleteAccount}>Confirm Delete</button>
            <button className="blue-button" onClick={() => setDeleteMode(false)}>Cancel</button>
          </div>
        </div>
      )}
      {editMode && (
        <div className="edit-form">
          <h3>Edit Profile</h3>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={editName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input type="text" id="address" name="address" value={editAddress} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input type="text" id="phoneNumber" name="phoneNumber" value={editPhoneNumber} onChange={handleInputChange} />
          </div>
          <div className="actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="blue-button" onClick={handleEdit}>Save</button>
            <button className="blue-button" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {message && <MessageBar message={message} />}
    </div>
  );
};

export default Me;
