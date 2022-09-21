// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.API_KEY_FIREBASE,
  authDomain: "shop-cbe4c.firebaseapp.com",
  projectId: "shop-cbe4c",
  storageBucket: "shop-cbe4c.appspot.com",
  messagingSenderId: "220392555544",
  appId: "1:220392555544:web:00cf7dae7107b596c5ef6d",
  measurementId: "G-E1BC0EDC41"
};

const app = initializeApp(firebaseConfig);

export default app;