import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import FoodPage from './pages/food/FoodPage';
import BalancePage from './pages/balance/BalancePage';
import LogoutPage from './pages/logout/LogoutPage';
import CartPage from './pages/cart/CartPage';
import OrderPage from './pages/order/OrderPage';
import ContactPage from './pages/contact/ContactPage';
import StatisticPage from './pages/statistic/StatisticPage';
import ManagementPage from './pages/management/ManagementPage';
import UserPage from './pages/user/UserPage';
import MePage from './pages/me/MePage';
import './App.css';
import { UserProvider, UserContext } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import UserBalances from './components/UserBalances';
import { BalanceProvider } from './context/BalanceContext';

const Navigation = () => {
  const { isLoggedIn, role } = useContext(UserContext);

  return (
    <nav className="nav">
      <Link to="/home" className="nav-link">Home</Link>
      <Link to="/food" className="nav-link">Food</Link>
      
      {isLoggedIn ? (
        <>
          <Link to="/cart" className="nav-link">Cart</Link>
          <Link to="/orders" className="nav-link">Orders</Link>
          <Link to="/balance" className="nav-link">Balance</Link>
          {role === 'ADMIN' && <Link to="/statistics" className="nav-link">Statistics</Link>}
          {role === 'ADMIN' && <Link to="/management" className="nav-link">Management</Link>}
          {role === 'ADMIN' && <Link to="/users" className="nav-link">Users</Link>}
          {role === 'USER' && <Link to="/me" className="nav-link">My Profile</Link>}
          <Link to="/logout" className="nav-link">Logout</Link>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      )}
      <Link to="/contact" className="nav-link">Contact</Link>
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
                  <Route path="/orders" element={<OrderPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/balance" element={<BalancePage />} />
                  <Route path="/logout" element={<LogoutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/statistics" element={<StatisticPage />} />
                  <Route path="/management" element={<ManagementPage />} />
                  <Route path="/users" element={<UserPage />} />
                  <Route path="/me" element={<MePage />} />
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
