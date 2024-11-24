// Firebase.js

import { 
  initializeApp 
} from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendEmailVerification 
} from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBrXHjgcrhb5V5gTEQpE85kdYJXc61JCUk",
  authDomain: "cram-a3297.firebaseapp.com",
  projectId: "cram-a3297",
  storageBucket: "cram-a3297.firebasestorage.app",
  messagingSenderId: "850194777586",
  appId: "1:850194777586:web:9abbd58f87b4c65a4b176b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign up function with email verification
const signUp = async (email, password) => {
  try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // userCredential contains the user object

      // Send email verification if not verified
      if (!user.emailVerified) {
          await sendEmailVerification(user);
          alert('Verification email sent! Please check your inbox.');
      } else {
          alert('Your email is already verified!');
      }
  } catch (error) {
      console.error("Error signing up:", error);
      alert('Error signing up: ' + error.message);
  }
};

const resendVerificationEmail = async (user) => {
  try {
      if (!user.emailVerified) {
          await sendEmailVerification(user);
          alert('Verification email sent again! Please check your inbox.');
      } else {
          alert('Your email is already verified!');
      }
  } catch (error) {
      console.error("Error resending verification email:", error);
      alert('Error resending email: ' + error.message);
  }
};



// Sign in function
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if the email is verified
    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in.');
    }

    console.log('User signed in:', user.email);
    return user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error; // Throw error to be handled in Auth-test.js
  }
};

// Google Sign-in function
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Signed in with Google as:", user.displayName);
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
};

// Sign out function
const signOut = async () => {
  try {
    await firebaseSignOut(auth);  // Sign out using Firebase's signOut function
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

// Authentication state listener
const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Function to get the currently logged-in user's email
const getCurrentUserEmail = () => {
  const user = auth.currentUser; // Get the current user
  if (user) {
    return user.email; // Return the user's email if logged in
  } else {
    console.warn("No user is currently logged in.");
    return null; // Return null if no user is logged in
  }
};

// Function to get the currently logged-in user's UID
const getUID = () => {
  const user = auth.currentUser; // Get the current user
  if (user) {
    return user.uid; // Return the user's UID if logged in
  } else {
    console.warn("No user is currently logged in.");
    return null; // Return null if no user is logged in
  }
};

// Export all functions
export { 
  signUp, 
  signIn, 
  signOut, 
  onAuthChange, 
  signInWithGoogle, 
  getCurrentUserEmail,
  getUID
 };
