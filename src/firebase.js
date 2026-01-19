import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Use Firestore
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: "my-portfolio-1506f.firebaseapp.com",
  projectId: "my-portfolio-1506f",
  storageBucket: "my-portfolio-1506f.firebasestorage.app",
  messagingSenderId: "661902297054",
  appId: "1:661902297054:web:0ab45cd0e7a532363c7f4f",
  measurementId: "G-BNSXFMDTZ0"
};

const app = initializeApp(firebaseConfig);

// These EXPORTS are required for App.jsx to work
export const db = getFirestore(app); 
export const auth = getAuth(app);