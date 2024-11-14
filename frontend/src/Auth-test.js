import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, signOut, onAuthChange } from "./Firebase"; // Add signOut import
import "./Auth-test.css"; // Import your CSS file

const AuthTest = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Update useEffect to ensure that the user is signed out properly
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        navigate("/app"); // Redirect to /app after successful login
      } else {
        setUser(null); // Set user to null when signed out
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  const handleSignUp = async () => {
    try {
      const newUser = await signUp(email, password);
      setUser(newUser);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const signedInUser = await signIn(email, password);
      setUser(signedInUser);
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
            <h2>Sign In / Sign Up</h2>
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
            </div>
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTest;
