import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { loginUser,handleGoogleLogin } from '../../../redux/apiCalls/authApiCalls'
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();

  const clientId = '1033354121282-u5gtukmv264p62cb925373op610hccq3.apps.googleusercontent.com'

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        client_id: clientId
      });
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const responseGoogle = (response) => {
    dispatch(handleGoogleLogin(response));
    console.log("🚀 ~ responseGoogle ~ response:", response)
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
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
            <GoogleLogin
              clientId= {clientId}
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </Box>


          <Typography align="center">
            Don't have an account?
            <Link to={"/register"}>
              Sign Up
            </Link>
          </Typography>
        </form>
      </Paper>

      <Helmet>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          onLoad={() => console.log('Google Identity Services script loaded successfully')}
          onError={() => console.error('Failed to load Google Identity Services script')}
        />
      </Helmet>
    </Box>
  );
};

export default Login;