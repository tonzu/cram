import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

// Sign up function
const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert('User signed up: ' + userCredential.user.email);
    } catch (error) {
        console.error("Error signing up:", error);  // Log the error to the console
        alert('Error signing up: ' + error.message);
    }
};

// Sign in function
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
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

export { signUp, signIn, signOut, onAuthChange, signInWithGoogle };
