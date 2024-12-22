import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import { toast } from "react-toastify";

//create context
export const AuthContext = createContext();

//provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //hold user data
  const [authLoading, setAuthLoading] = useState(true); //Loading state

  //Fetch User data on page load or token refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/auth/getUserProfile");
        setUser(res.data.user);
      } catch (error) {
        console.error("Not authenticated:", error.message);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
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
    try {
        const res = await axios.post("/auth/signin", credentials,{withCredentials:true});
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        return {success:true,message:res.data.msg};
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
  const signOut = async ()=>{
      try {
        await axios.get('/auth/logout',{withCredentials:true});
        setUser(null);
        localStorage.removeItem('token');
        toast.success("Logged out successfully");
      } catch (error) {
        toast.error("Logout failed. Please try again.");
        console.error("Logout Error: ", error);
      }
  }

  return(
    <AuthContext.Provider value={{user,register,signIn,signOut,authLoading}}>
        {children}
    </AuthContext.Provider>
  )

};


// Add PropTypes validation
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Ensure `children` is passed
  };
