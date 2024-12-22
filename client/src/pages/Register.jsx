import {useContext, useState} from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context-api/authContext';


const Register = () => {
  const [formData,setFormData]= useState({
    username:'',
    email:'',
    password:'',
  });
  const {register} = useContext(AuthContext);
  const navigate=useNavigate();

  //Handle input changes
  const handleChange = (e) =>{
   setFormData({
    ...formData,
    [e.target.name]:e.target.value
   });
  }

  //Handle Form Submission
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const {success,message} = await register(formData);
      if(success){
        toast.success(message);
        setTimeout(() => {
          navigate('/signin');
        }, 1000);
      }else{
        toast.error(message);
      }
    } catch (error) {
      const errorMessage = error.response && error.response.data.message ? error.response.data.message : 'Something went Wrong.Please try again later';
      toast.error(errorMessage);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-700 mb-6 text-center">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-slate-600 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name='username'
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-slate-300"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name='email'
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-slate-300"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name='password'
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-slate-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-700 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="border-t flex-grow"></div>
          <span className="mx-2 text-slate-500">OR</span>
          <div className="border-t flex-grow"></div>
        </div>
        <button
          type="button"
          className="w-full flex items-center justify-center border border-slate-300 py-2 rounded-lg hover:bg-slate-100 transition duration-200"
        >
          <FaGoogle className="text-slate-500 mr-2" />
          Continue with Google
        </button>
        <p className="text-center text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/signin" className="text-slate-700 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
