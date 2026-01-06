import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Use Firestore
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAitf65Rh-3eG-jQ_hjmbElvi7qyH8pFnc", //
  authDomain: "my-portfolio-1506f.firebaseapp.com", //
  projectId: "my-portfolio-1506f", //
  storageBucket: "my-portfolio-1506f.firebasestorage.app", //
  messagingSenderId: "661902297054", //
  appId: "1:661902297054:web:61de520753c686613c7f4f" //
};

const app = initializeApp(firebaseConfig);

// These EXPORTS are required for App.jsx to work
export const db = getFirestore(app); 
export const auth = getAuth(app);