import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

const GoogleLoginButton = () => {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  
  const email = searchParams.get("email");
  const fullname = searchParams.get("fullname");
  const secret = searchParams.get("secret");

  // First useEffect to handle URL parameters and localStorage
  useEffect(() => {
    // Check if we have URL parameters
    if (email && fullname && secret) {
      const userData = {
        email,
        fullname,
        secret,
      };
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      // Try to get user from localStorage if no URL parameters
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          localStorage.removeItem("user"); // Clear invalid data
        }
      }
    }
  }, [email, fullname, secret]); // Add dependencies to ensure effect runs when params change

  // Handle Google login form submission
  const handleGoogleLogin = (e) => {
    // No need to prevent default as we want the form to submit to the Google auth endpoint
  };

  return (
    <>
      {!user && (
        <form action="http://localhost:4000/api/auth/google" method="GET" onSubmit={handleGoogleLogin}>
          <button type="submit">Sign in with Google</button>
        </form>
      )}
      {user && (
        <div>
          <p>Logged in as: {user.email}</p>
        </div>
      )}
    </>
  );
};

export default GoogleLoginButton;
