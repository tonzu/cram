import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, signOut, onAuthChange, signInWithGoogle } from "./Firebase";
import "./Auth-test.css";
import backgroundVideo from "./background.mp4";
import { FcGoogle } from "react-icons/fc";


const AuthTest = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        navigate("/app");
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
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
      await signOut();
      setUser(null);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const googleUser = await signInWithGoogle();
      setUser(googleUser);
    } catch (err) {
      setError("Google sign-in failed");
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(null);
  };

  return (
    <div className="auth-container">
      <video className="auth-video" autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="auth-box">
        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div className="auth-form">
            <h2>Welcome to CRAM</h2>
            <input
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="Password"
            />
            <div>
              <button onClick={handleSignUp}>Sign Up</button>
              <button onClick={handleSignIn}>Sign In</button>
              <button onClick={handleGoogleSignIn} className="google-signin">
                <FcGoogle className="google-icon" /> Sign in with Google
              </button>
            </div>
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTest;
