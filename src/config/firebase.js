import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhHc-qK_CCBp-hg9HctGOIeJSjZRsfe20",
  authDomain: "begin-9bf91.firebaseapp.com",
  projectId: "begin-9bf91",
  storageBucket: "begin-9bf91.appspot.com",
  messagingSenderId: "606667873403",
  appId: "1:606667873403:web:84f2c10bbca42bf07196de",
  measurementId: "G-747V6K39YF",
};

// Initialize Firebase
// for every service, we must pass in the app variable to initialize it

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app); //we will use this variable in our project
export const db = getFirestore(app); //another variable
export const storage = getStorage(app);
