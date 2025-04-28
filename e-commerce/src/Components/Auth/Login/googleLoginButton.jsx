import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Open Google login page in a new window for better UX
    const googleAuthUrl = `${process.env.REACT_APP_API_URL}/auth/google`;
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      googleAuthUrl,
      'googleAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    // Listen for message from the popup
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.auth) {
        // Handle successful authentication
        navigate('/dashboard');
      }
    }, { once: true });
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      className="google-login-button"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
        alt="Google logo" 
      />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;