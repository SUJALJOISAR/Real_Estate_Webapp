import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoctnb7X4Z5zruAKrEwuURElpznpZVES8",
  authDomain: "realestatewebapp-67850.firebaseapp.com",
  projectId: "realestatewebapp-67850",
  storageBucket: "realestatewebapp-67850.firebasestorage.app",
  messagingSenderId: "479116034317",
  appId: "1:479116034317:web:3bd5548c2438e8b69a7044",
  measurementId: "G-10FS4NB9ZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);

export {app,auth};