import React, { useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'; // Importing Dashboard component
import Receipts from './components/Receipts';
import Rewards from './components/Rewards'; // Importing Rewards component
import Coupons from './components/Coupons'; // Importing Coupons component
import Shops from './components/Shops'; // Importing Shops component
import Reports from './components/Reports'; // Importing Reports component
import Settings from './components/Settings'; // Importing Settings component
import { Box, CssBaseline } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './components/Login'; // Importing Login component
import Signup from './components/Signup'; // Importing Signup component
import ForgotPassword from './components/ForgotPassword'; // Importing ForgotPassword component

function App() { // Main application component
  const [filter, setFilter] = useState('Weekly'); // State to manage the selected filter
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication status
  const [users, setUsers] = useState([]); // State to manage registered users
  const location = useLocation();
  const currentPage = location.pathname.split('/').pop() || 'Dashboard'; // Get current page from URL

  const handleSignup = ({ username, password }) => {
    // Logic to handle signup
    setUsers([...users, { username, password }]);
    console.log('User signed up:', username);
  };

  const handleLogin = ({ username, password }) => {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      setIsAuthenticated(true);
      console.log('User logged in:', username);
    } else {
      console.error('Invalid credentials');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Normalize CSS across browsers */}
      <CssBaseline />
      
      {/* Header component at the top */}
      <Header currentPage={currentPage} setFilter={setFilter} /> {/* Pass current page and setFilter to Header */}
      
      {/* Sidebar component on the left */}
      <Sidebar />
      
      {/* Main content area */}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} /> {/* Redirect to login if not authenticated */}
        <Route path="/login" element={<Login handleLogin={handleLogin} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup handleSignup={handleSignup} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/receipts" element={isAuthenticated ? <Receipts /> : <Navigate to="/login" />} />
        <Route path="/shops" element={isAuthenticated ? <Shops /> : <Navigate to="/login" />} />
        <Route path="/rewards" element={isAuthenticated ? <Rewards /> : <Navigate to="/login" />} />
        <Route path="/coupons" element={isAuthenticated ? <Coupons /> : <Navigate to="/login" />} />
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
      </Routes>
    </Box>
  );
}

export default App;
