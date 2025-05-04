import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { handleGoogleLogin } from '../../../redux/apiCalls/authApiCalls';
import { gapi } from 'gapi-script';
import { Box } from '@mui/material';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  const clientId = '1033354121282-u5gtukmv264p62cb925373op610hccq3.apps.googleusercontent.com'

  React.useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        client_id: clientId
      });
    });
  }, []);

  const responseGoogle = async (e) => {
    // e.preventDefault()
    dispatch(handleGoogleLogin(response));
    console.log("responseGoogl", response)
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLoginButton;