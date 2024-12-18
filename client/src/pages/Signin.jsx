import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SignIn = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-700 mb-6 text-center">
          Sign In to Your Account
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-slate-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-slate-700 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-slate-700 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 transition duration-200"
          >
            Sign In
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
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-slate-700 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;