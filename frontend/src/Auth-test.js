// Auth-test.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, signOut, onAuthChange, signInWithGoogle } from "./Firebase"; // Import functions
import "./Auth-test.css";

const AuthTest = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onAuthChange((currentUser) => {
    if (currentUser) {
      if (currentUser.emailVerified) {
        // If email is verified, proceed to the app
        setUser(currentUser);
        navigate("/app");
      } else {
        // If not verified, show message
        setUser(null);
        //alert("Please verify your email before logging in.");
      }
    } else {
      setUser(null); // No user is logged in, stay on login screen
    }
  });
  return () => unsubscribe();
}, [navigate]);


  const handleSignUp = async () => {
    try {
      const newUser = await signUp(email, password);
      // Email verification is automatically triggered within signUp function.
      setUser(newUser);
      // alert("Please check your email for the verification link.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const signedInUser = await signIn(email, password);
      if (signedInUser.emailVerified) {
        setUser(signedInUser);
        navigate("/app"); // Redirect to app if email is verified
      } else {
        //alert("Please verify your email before logging in.");
        setUser(null); // Clear user state if email is not verified
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // Call Firebase signOut function
      setUser(null); // Reset the user state to null
      navigate("/"); // Redirect to login page after sign-out
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const googleUser = await signInWithGoogle();
      setUser(googleUser);
      navigate("/app"); // Directly navigate to /app if sign-in with Google succeeds
    } catch (error) {
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div className="auth-form">
            <h2>Login to CRAM</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <div>
              <button onClick={handleSignUp}>Sign Up</button>
              <button onClick={handleSignIn}>Sign In</button>
              <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            </div>
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTest;
