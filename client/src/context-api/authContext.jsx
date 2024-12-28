import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import { toast } from "react-toastify";
import { onAuthStateChanged,signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

//create context
export const AuthContext = createContext();

//provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //hold user data
  const [authLoading, setAuthLoading] = useState(true); //Loading state

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = localStorage.getItem("token");
      const googleToken = JSON.parse(localStorage.getItem("google_token") || "{}");
  
      if (authToken) {
        // Use Axios login
        try {
          const res = await axios.get("/auth/getUser", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setUser(res.data.user);
        } catch (error) {
          console.error("Manual auth_token error:", error.message);
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      } else if (googleToken?.token && googleToken.expirationTime > Date.now()) {
        // Use Firebase login
        try {
          const { email } = googleToken; // Destructure Google token data
        if (!email) {
          throw new Error("Email is missing in Google token.");
        }
          const username = googleToken.email.split("@")[0];
          setUser({
            username,
            email: googleToken.email,
            token: googleToken.token,
          });
        } catch (error) {
          console.error("Google token error:", error.message);
          localStorage.removeItem("google_token");
          setUser(null);
        }
      } else {
        // No valid token
        setUser(null);
      }
      setAuthLoading(false);
    };
  
    // Listen for Firebase Auth changes
    const unsubscribeFirebaseAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const username = firebaseUser.email.split("@")[0];
        const avatar = firebaseUser.photoURL;
        setUser({
          username,
          email: firebaseUser.email,
          avatar,
          token,
        });
        localStorage.setItem(
          "google_token",
          JSON.stringify({ token, email: firebaseUser.email, expirationTime: Date.now() + 24 * 60 * 60 * 1000 })
        );
      } else {
        setUser(null);
        localStorage.removeItem("google_token");
      }
    });
  
    // Check authentication on mount
    checkAuth();
  
    return () => unsubscribeFirebaseAuth();
  }, []);
  


  //Register Function
  const register = async (userData) => {
    try {
      const res = await axios.post("/auth/register", userData);
      setUser(res.data.user);
      return {
        success: true,
        message: res.data.msg,
      };
    } catch (error) {
      console.log(
        "Registration Error:",
        error.response?.data?.msg || error.message
      );
      return {
        success: false,
        message: error.response?.data?.msg || "Registration Failed",
      };
    }
  };

  //signin function
  const signIn = async (credentials) => {
    // const token=localStorage.get('token');
    try {
      const res = await axios.post("/auth/signin", credentials, { withCredentials: true });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      return { success: true, message: res.data.msg };
    } catch (error) {
      console.error(
        "Sign-in error:",
        error.response?.data?.msg || error.message
      );
      return {
        success: false,
        message: error.response?.data?.msg || "Sign-in failed",
      };
    }
  };

  //signout
 
  // Sign-out
  const signOut = async () => {
    try {
      await axios.get("/auth/logout");
      firebaseSignOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("google_token");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout Error:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, register, signIn, signOut, authLoading }}>
      {children}
    </AuthContext.Provider>
  )

};


// Add PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensure `children` is passed
};
