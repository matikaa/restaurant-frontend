import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios'; // Importujemy axios
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import FoodPage from './pages/food/FoodPage';
import BalancePage from './pages/balance/BalancePage';
import './App.css';
import { UserProvider, UserContext } from './context/UserContext'; // Importujemy UserProvider i UserContext

const App = () => {
  return (
    <Router>
      <UserProvider> {/* Dodajemy provider kontekstu użytkownika */}
        <div className="app">
          <header className="header">
            <h1>M&M Restaurant</h1>
            <nav className="nav">
              <Link to="/home" className="nav-link">
                Home
              </Link>
              <Link to="/food" className="nav-link">
                Food
              </Link>
              <Link to="/orders" className="nav-link">
                Orders
              </Link>
              <Link to="/cart" className="nav-link">
                Cart
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
              <Link to="/balance" className="nav-link">
                Balance
              </Link>
              <UserBalances /> {/* Dodajemy komponent UserBalances */}
            </nav>
          </header>
          <main className="main">
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/food" element={<FoodPage />} />
              <Route path="/orders" element={<div>Orders Page</div>} />
              <Route path="/cart" element={<div>Cart Page</div>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/balance" element={<BalancePage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>&copy; 2024 M&M Restaurant. All rights reserved.</p>
          </footer>
        </div>
      </UserProvider> {/* Zamykamy provider kontekstu użytkownika */}
    </Router>
  );
};

const UserBalances = () => {
  const { token, userId } = useContext(UserContext);
  const [balance, setBalance] = useState(0);
  const [cartBalance, setCartBalance] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchBalances = async () => {
      if (token && userId) {
        try {
          const balanceResponse = await axios.get(`http://localhost:8080/users/${userId}/balance`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBalance(balanceResponse.data.money);

          const cartResponse = await axios.get(`http://localhost:8080/users/${userId}/cart/order`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartBalance(cartResponse.data.cartValue);
        } catch (error) {
          console.error('Failed to fetch balances:', error);
        }
      } else {
        setBalance(0);
        setCartBalance(0);
      }
    };

    fetchBalances();
  }, [token, userId, location.pathname]); // Dodajemy location.pathname jako zależność

  return (
    <div className="user-balances">
      <div>Balance: ${balance && balance.toFixed(2)}</div>
      <div>Cart Balance: ${cartBalance && cartBalance.toFixed(2)}</div>
    </div>
  );
};

export default App;
