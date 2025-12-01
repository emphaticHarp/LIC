// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKlsb_AuQXX47g6mY7ku5WnOkTrI4esn8",
  authDomain: "streamverse-3b429.firebaseapp.com",
  projectId: "streamverse-3b429",
  storageBucket: "streamverse-3b429.firebasestorage.app",
  messagingSenderId: "340426404357",
  appId: "1:340426404357:web:9ff7006776b9ea9bed626c",
  measurementId: "G-BG7E558RC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (optional - only on client side)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export default app;
