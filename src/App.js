import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import DataView from './pages/DataView';
import Register from "./pages/Register"

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = JSON.parse(localStorage.getItem('authToken'));

  useEffect(() => {
    if (!loggedIn && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [loggedIn, location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={loggedIn ? <Homepage /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/data/:key" element={<DataView />} />
      </Routes>
    </>
  );
};

export default App;