import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context-api/authContext"; // Assuming you have this context
import { toast } from "react-toastify"; // For displaying success/error messages
import axios from "axios";
import { FaEdit } from "react-icons/fa"; // Icon for editing avatar

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext); // Getting user context
    const [avatar, setAvatar] = useState(user?.avatar); // Default avatar if none
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState(""); // Empty password field

    useEffect(() => {
        // If the user data changes, update the state accordingly
        if (user) {
            setAvatar(user.avatar);
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    // Handle avatar update (via Google or Axios login)
    const handleAvatarUpdate = async (e) => {
        // Logic to update avatar using Google or Axios login (you can open a modal or redirect to a file upload)
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await axios.post("/user/uploadavatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Log the response to debug
            console.log("Upload Response:", response.data);

            //update the user's avatar in the frontend
             const updatedAvatar = `http://localhost:5000${response.data.avatarUrl}`;
            setAvatar(updatedAvatar);
            setUser({ ...user, avatar: updatedAvatar });
            toast.success("Avatar updated successfully!");
        } catch (error) {
            toast.error("Error uploading avatar.", error);
        }
    };

    // Handle profile update
    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put("/api/update-profile", {
                username,
                email,
                password, // Don't send the password if it's empty
            });
            setUser(response.data.user); // Update user context
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Error updating profile.", error);
        }
    };

    // Handle create listing action
    const handleCreateListing = () => {
        // Redirect to create listing page or open modal
        console.log("Navigate to create listing page");
    };

    // Handle delete account action
    const handleDeleteAccount = async () => {
        // try {
        //   const response = await axios.delete("/api/delete-account");
        //   toast.success("Account deleted successfully.");
        //   setUser(null); // Clear user data after deletion
        // } catch (error) {
        //   toast.error("Error deleting account.",error);
        // }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 py-6 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
                    Update Profile
                </h2>

                {/* Avatar Section */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer">
                        <label htmlFor="avatarUpload" className="w-full h-full">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt=""
                                    className="w-full h-full object-cover opacity-80 hover:opacity-100"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaEdit className="text-gray-500 text-4xl" />
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 hover:opacity-100">
                                <FaEdit className="text-white text-2xl" />
                            </div>
                        </label>
                        <input
                            id="avatarUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpdate}
                        />
                    </div>
                </div>

                {/* Form Section */}
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </form>

                {/* Action Buttons */}
                <div className="mt-6 space-y-4">
                    <button
                        onClick={handleUpdateProfile}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                    >
                        Update Profile
                    </button>
                    <button
                        onClick={handleCreateListing}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                    >
                        Create Listing
                    </button>
                </div>

                {/* Delete Account Section */}
                <div className="mt-6 text-center">
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
