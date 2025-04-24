import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, doc, setDoc } from '../firebaseconfig';
import Logo from '../Logo.jpg'; // Import the logo image

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignupSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        username,
        email
      });
    // Logic to handle user registration can be added here
    // Note: Do not save signup data locally or to a server
    navigate('/login');
  }catch (err) {
    setError(err.message);
  }
  };

  const isSignupDisabled = !firstName || !lastName || !username || !email || !password || password !== confirmPassword;

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
        <Typography variant="h4" gutterBottom>Signup</Typography>
        <form onSubmit={handleSignupSubmit}>
          <TextField
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Re-enter Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
          />
          <Button type="submit" variant="contained" disabled={isSignupDisabled} sx={{ width: '100%' }}>Signup</Button>
          {error && <Typography color="error">{error}</Typography>}
        </form>
      </Paper>
    </Box>
  );
}

export default Signup;
