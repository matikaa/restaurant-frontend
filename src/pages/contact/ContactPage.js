import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './ContactPage.css';
import { UserContext } from '../../context/UserContext';

const ContactPage = () => {
  const [contactData, setContactData] = useState(null);
  const [editData, setEditData] = useState(null); 
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { isLoggedIn, role, token } = useContext(UserContext);

  const fetchContactData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/contact/1');
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      setContactData(response.data);
      setEditData(response.data);
    } catch (error) {
      setError('Failed to fetch contact data. Please try again.');
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const handleEditContact = async () => {
    if (isLoggedIn && role === 'ADMIN') {
      try {
        const response = await axios.put(
          'http://localhost:8080/contact/1',
          editData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response || !response.data) {
          throw new Error('Invalid response from server');
        }
        setContactData(response.data);
        setEditData(response.data);
        setIsEditing(false);
      } catch (error) {
        setError('Failed to update contact data. Please try again.');
      }
    } else {
      setError('Unauthorized access');
    }
  };

  const handleEditButtonClick = () => {
    setEditData(contactData);
    setIsEditing(true);
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      {error && <p className="error">{error}</p>}
      {contactData ? (
        <div className="contact-details">
          <p><strong>Email:</strong> {contactData.contactMail}</p>
          <p><strong>Phone:</strong> {contactData.contactPhoneNumber}</p>
          <p><strong>Opening Hours:</strong> {contactData.openingHoursDays} {contactData.openingHoursOpenTime} - {contactData.openingHoursCloseTime}</p>
          <p><strong>Address:</strong> {contactData.addressStreet} {contactData.addressNumber}, {contactData.addressCity}</p>
          {isLoggedIn && role === 'ADMIN' && !isEditing && <button className="edit-button" onClick={handleEditButtonClick}>Edit</button>}
        </div>
      ) : (
        <p>Loading contact data...</p>
      )}
      {isEditing && editData && (
        <div className="edit-form">
          <h2>Edit Contact</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleEditContact(); }}>
            <div className="label-input-container">
              <label>Email:</label>
              <input type="text" value={editData.contactMail} onChange={(e) => setEditData({ ...editData, contactMail: e.target.value })} placeholder="Email" />
            </div>
            <div className="label-input-container">
              <label>Phone Number:</label>
              <input type="text" value={editData.contactPhoneNumber} onChange={(e) => setEditData({ ...editData, contactPhoneNumber: e.target.value })} placeholder="Phone Number" />
            </div>
            <div className="label-input-container">
              <label>Opening Hours Days:</label>
              <input type="text" value={editData.openingHoursDays} onChange={(e) => setEditData({ ...editData, openingHoursDays: e.target.value })} placeholder="Opening Hours Days" />
            </div>
            <div className="label-input-container">
              <label>Opening Hours Open Time:</label>
              <input type="text" value={editData.openingHoursOpenTime} onChange={(e) => setEditData({ ...editData, openingHoursOpenTime: e.target.value })} placeholder="Opening Hours Open Time" />
            </div>
            <div className="label-input-container">
              <label>Opening Hours Close Time:</label>
              <input type="text" value={editData.openingHoursCloseTime} onChange={(e) => setEditData({ ...editData, openingHoursCloseTime: e.target.value })} placeholder="Opening Hours Close Time" />
            </div>
            <div className="label-input-container">
              <label>City:</label>
              <input type="text" value={editData.addressCity} onChange={(e) => setEditData({ ...editData, addressCity: e.target.value })} placeholder="City" />
            </div>
            <div className="label-input-container">
              <label>Street:</label>
              <input type="text" value={editData.addressStreet} onChange={(e) => setEditData({ ...editData, addressStreet: e.target.value })} placeholder="Street" />
            </div>
            <div className="label-input-container">
              <label>Address Number:</label>
              <input type="number" value={editData.addressNumber} onChange={(e) => setEditData({ ...editData, addressNumber: e.target.value })} placeholder="Address Number" />
            </div>
            <div className="button-container">
              <button type="submit" className="edit-button">Save</button>
              <button type="button" className="edit-button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
