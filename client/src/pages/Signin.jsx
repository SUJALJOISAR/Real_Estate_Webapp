import { useContext, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context-api/authContext';

const SignIn = () => {
    const [formdata, setFormData] = useState({
        email: '',
        password: '',
    });
    const {signIn}=useContext(AuthContext);

    const navigate = useNavigate();

    //Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    //Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {success,message} = await signIn(formdata);
            if (success) {
                toast.success('Signed In Successfully');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }else {
                toast.error(message); // Display error toast for unsuccessful sign-in
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
                    Sign In to Your Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-slate-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formdata.email}
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
                            name="password"
                            value={formdata.password}
                            onChange={handleChange}
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
