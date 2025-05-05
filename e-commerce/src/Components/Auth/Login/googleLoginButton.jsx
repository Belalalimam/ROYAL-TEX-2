import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { Button, Box, Alert, AlertTitle, Paper, Container, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Login component mounted');
    
    try {
      // Debug: Log all URL parameters
      const params = {
        email: searchParams.get("email"),
        fullname: searchParams.get("fullname"),
        secret: searchParams.get("secret"),
        pic: searchParams.get("pic")
      };
      console.log('URL Parameters:', params);

      // Check if we have all required parameters
      if (params.email && params.fullname && params.secret && params.pic) {
        console.log('All parameters present, creating user object');
        const userData = { 
          email: params.email, 
          fullname: params.fullname, 
          secret: params.secret, 
          pic: params.pic 
        };
        
        // Store in localStorage
        console.log('Storing user data in localStorage:', userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        setLoading(false);
      } else {
        console.log('Not all parameters present, checking localStorage');
        const storedUser = localStorage.getItem("userInfo");
        
        if (storedUser) {
          console.log('Found user in localStorage:', storedUser);
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error('Error parsing stored user:', e);
            setError('Failed to parse user data');
          }
        } else {
          console.log('No user found in localStorage');
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in login component:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("Current URL:", window.location.href);
    console.log("URL Search:", window.location.search);
  }, []);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        {user ? (
          <Alert severity="success">
            <AlertTitle>Welcome {user.email}</AlertTitle>
            <div>Name: {user.fullname}</div>
          </Alert>
        ) : (
          <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
            <form action="http://localhost:4000/api/auth/google">
              <Button
                fullWidth
                variant="contained"
                type="submit"
                startIcon={<GoogleIcon />}
                sx={{ py: 1.5 }}
              >
                Sign in with Google
              </Button>
            </form>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default Login;