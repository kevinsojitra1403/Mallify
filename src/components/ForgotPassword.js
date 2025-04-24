import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo.jpg'; // Import the logo image

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    // Logic to handle password reset
    setMessage('Password reset link has been sent to your email.');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        width: '100%', // Stretch content
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: '400px', textAlign: 'center' }}>
        <img src={Logo} alt="Logo" style={{ width: '100%', marginBottom: '20px' }} /> {/* Logo added */}
        <Typography variant="h4" gutterBottom>Forgot Password</Typography>
        <form onSubmit={handleResetSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
            inputProps={{ autoComplete: 'email' }} // Added autocomplete
          />
          <Button type="submit" variant="contained" sx={{ width: '100%' }}>Reset Password</Button>
        </form>
        {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}
        <Button variant="outlined" onClick={() => navigate('/login')} sx={{ width: '100%', mt: 2 }}>Back to Login</Button>
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
