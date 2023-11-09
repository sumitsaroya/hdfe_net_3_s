import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import DataView from './pages/DataView';
import Register from "./pages/Register"

const App = () => {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={ <Homepage /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/data/:key" element={<DataView />} />
      </Routes>
    </>
  );
};

export default App;
