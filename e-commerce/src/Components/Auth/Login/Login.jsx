import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Divider } from '@mui/material';
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../redux/apiCalls/authApiCalls'
import GoogleLoginButton from '../googleLoginButton';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}

          />
          

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Divider>Or</Divider>
          <GoogleLoginButton prop='Sing in' />
          <Typography align="center">
            Don't have an account?
            <Link to={"/register"}>
              Sign Up
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;