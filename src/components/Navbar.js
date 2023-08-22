import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const loggedIn = JSON.parse(localStorage.getItem('authToken'));

  const [resetOpen, setResetOpen] = useState(false); // State for password reset popup
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // handle logout
  const handleLogout = async () => {
    try {
      await axios.post('https://trialbackend-production.up.railway.app/api/v1/auth/logout');
      localStorage.removeItem('authToken');
      toast.success('Logout successfully');
      // Replace the current history entry with the homepage URL
      window.history.replaceState(null, '', '/');
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setResetOpen(true); // Open the password reset popup
  };

  const handleResetDone = async () => {
    try {
      // Make a request to reset the password in the backend using the email and newPassword state variables
      await axios.post('https://trialbackend-production.up.railway.app/api/v1/auth/reset-password', { email, newPassword });
      toast.success('Password updated successfully');
      setResetOpen(false); // Close the password reset popup
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseReset = () => {
    setResetOpen(false); // Close the password reset popup without performing any action
  };

  useEffect(() => {
    if (!loggedIn && navigate) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  return (
    <Box
      width="100%"
      backgroundColor={theme.palette.background.alt}
      p="1rem 6%"
      textAlign="center"
      sx={{ boxShadow: 3, mb: 2 }}
    >
      <Typography className='text-danger' variant="h4" color="primary" fontWeight="bold">
      Sukun HDFC Card Data
      </Typography>
      {loggedIn ? (
        <>
          <Button
       
            onClick={handleReset}
            variant="outlined"
            sx={{ marginRight: '1rem' }} // Added styling
          >
            Reset Password
          </Button>
          <NavLink
            className="btn btn-danger"
            to="/"
            onClick={handleLogout}
            variant="outlined"
             // Added styling
          >
            Logout
          </NavLink>
        </>
      ) : (
        <>
          {/* <NavLink
            to="/register"
            sx={{ padding: '1rem' , textDecoration: 'none' }} // Added styling
          >
            Sign Up
          </NavLink> */}
          <NavLink
            className="btn  text-danger"
            to="/login"
            sx={{ padding: '5px', textDecoration: 'none' }}
            // Added styling
          >
            Sign In
          </NavLink>
        </>
      )}

      {/* Password Reset Popup */}
      <Dialog open={resetOpen} onClose={handleCloseReset}>
        <DialogTitle >Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetDone}>Done</Button>
          <Button onClick={handleCloseReset}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Navbar;
