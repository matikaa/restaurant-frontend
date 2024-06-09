// App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import FoodPage from './pages/food/FoodPage';
import BalancePage from './pages/balance/BalancePage';
import LogoutPage from './pages/logout/LogoutPage'; // Importujemy LogoutPage
import './App.css';
import { UserProvider, UserContext } from './context/UserContext'; // Importujemy UserContext
import { CartProvider } from './context/CartContext';
import UserBalances from './components/UserBalances'; // Upewnij się, że ścieżka jest poprawna
import { BalanceProvider } from './context/BalanceContext';
import CartPage from './pages/cart/CartPage';

const Navigation = () => {
  const { isLoggedIn } = useContext(UserContext); // Pobieramy informację o zalogowaniu użytkownika

  return (
    <nav className="nav">
      <Link to="/home" className="nav-link">Home</Link>
      <Link to="/food" className="nav-link">Food</Link>
      <Link to="/orders" className="nav-link">Orders</Link>
      <Link to="/cart" className="nav-link">Cart</Link>
      {isLoggedIn ? ( // Warunkowe wyświetlanie linków w zależności od zalogowania użytkownika
        <>
          <Link to="/balance" className="nav-link">Balance</Link>
          <Link to="/logout" className="nav-link">Logout</Link>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      )}
      <UserBalances />
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <BalanceProvider>
            <div className="app">
              <header className="header">
                <h1>M&M Restaurant</h1>
                <Navigation />
              </header>
              <main className="main">
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/food" element={<FoodPage />} />
                  <Route path="/orders" element={<div>Orders Page</div>} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/balance" element={<BalancePage />} />
                  <Route path="/logout" element={<LogoutPage />} />
                  <Route path="/" element={<HomePage />} />
                </Routes>
              </main>
              <footer className="footer">
                <p>&copy; 2024 M&M Restaurant. All rights reserved.</p>
              </footer>
            </div>
          </BalanceProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
