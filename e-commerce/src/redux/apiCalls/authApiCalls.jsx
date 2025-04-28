import { authActions } from "../slices/authSlic";
import request from "../../utils/request";
import { toast } from "react-toastify";
import { GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';

export function loginUser(user, isGoogleLogin = false) {
  return async (dispatch) => {
    try {
      if (isGoogleLogin) {
        // Handle Google login
        // const { data } = await request.post('/api/auth/login', user);
        dispatch(authActions.Login(user));
        localStorage.setItem('userInfo', JSON.stringify(user));
        // window.location.reload();
        console.log("🚀 ~ loginUser ~ data:", user)
      } else {
        // Handle manual login
        const { data } = await request.post('/api/auth/login', user);
        dispatch(authActions.Login(data));
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
}

export function handleGoogleLogin(response) {
  console.log("🚀 ~ handleGoogleLogin ~ response:", response)
  return (dispatch) => {
    try {
      if (response?.profileObj) {
        const data = {
          _id: response.profileObj.googleId,
          name: response.profileObj.name,
          email: response.profileObj.email,
          token: response.tokenId,
          imageUrl: response.profileObj.imageUrl,
          isAdmin: false, // Default value, adjust as needed
        };

        dispatch(loginUser(data, true));
      } else {
        toast.error("Google login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Google login failed");
    }
  };
}

export const logoutUser = () => async (dispatch) => {
  try {
    localStorage.removeItem("userInfo");
    dispatch({ type: "LOGOUT" });
    window.location.href = '/';  // This will ensure direct navigation to homepage
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


export function registerUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await request.post('/api/auth/register', user);
      dispatch(authActions.register(data.message))
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    }

  }
}



export function verifyEmail(userId, token) {
  return async (dispatch) => {
    try {
      await request.get(`/api/auth/${userId}/verify/${token}`);
      dispatch(authActions.setIsEmailVerified());
    } catch (error) {
      console.log(error);
    }
  }
}