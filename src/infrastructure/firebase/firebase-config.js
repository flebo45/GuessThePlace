import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcHvgdkcJ0SS9_-t74ycPFJG5VTcSz7j8",
  authDomain: "guesstheplace-5ba28.firebaseapp.com",
  databaseURL: "https://guesstheplace-5ba28.firebaseio.com",
  projectId: "guesstheplace-5ba28",
  storageBucket: "guesstheplace-5ba28.firebasestorage.app",
  messagingSenderId: "583921403533",
  appId:"583921403533"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

