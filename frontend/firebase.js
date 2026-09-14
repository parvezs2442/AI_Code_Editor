import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-code-editor-27a31.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-code-editor-27a31",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-code-editor-27a31.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "788130324850",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:788130324850:web:13153ef31b58460154fdeb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KHE34DD4GV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();