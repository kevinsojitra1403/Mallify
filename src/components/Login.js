import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Snackbar } from '@mui/material';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, doc, setDoc } from '../firebaseconfig';
import Logo from '../Logo.jpg'; // Import the logo image

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // Logic to validate user credentials can be added here
    // Note: Do not save login data locally or to a server
    try {
      await signInWithEmailAndPassword(auth, username, password);
    setIsAuthenticated(true);
    navigate('/');
  }catch (err) {
    setError("Invalid username or password.");
  }
  };

  const handleClose = () => setError('');

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
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleLoginSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
            inputProps={{ autoComplete: 'username' }} // Added autocomplete
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
            inputProps={{ autoComplete: 'current-password' }} // Added autocomplete
          />
          <Button type="submit" variant="contained" sx={{ width: '100%', mb: 1 }}>Login</Button>
        </form>
        <Button variant="outlined" onClick={() => navigate('/signup')} sx={{ width: '100%' }}>Signup</Button>
        <Snackbar
          open={error}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Invalid username or password"
        />
      </Paper>
    </Box>
  );
}

export default Login;
