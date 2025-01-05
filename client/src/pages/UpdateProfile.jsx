import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context-api/authContext"; // Assuming you have this context
import { toast } from "react-toastify"; // For displaying success/error messages
import axios from "axios";
import { FaEdit } from "react-icons/fa"; // Icon for editing avatar

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext); // Getting user context
    const [username, setUsername] = useState(user?.username || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState(""); // Empty password field
    const [tempAvatar, setTempAvatar] = useState(null); // For temporary preview

    useEffect(() => {
        // If the user data changes, update the state accordingly
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setAvatar(user.avatar);
        }
    }, [user]);

    // console.log("ProfilePage user:", user);
    // console.log("ProfilePage avatar outside:",user.avatar);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempAvatar(URL.createObjectURL(file)); // Create a temporary preview URL
        }
    };

    const handleUpdateProfile = async (e) => {
        try {
            let avatarUrl = avatar; // Keep existing avatar if not updated
            console.log("avatarURL inside:",avatarUrl);
            // const file = e.target?.files?.[0]; // Check if a file is being uploaded

            // Log to check if the file is selected
            // console.log("File selected:", file);

            // If a new avatar is uploaded, handle avatar upload
            // if (tempAvatar) {
            //     const formData = new FormData();
            //     formData.append("username", username); // Append username
            //     formData.append("email", email);       // Append email
            //     if (password) {
            //         formData.append("password", password); // Append password if not empty
            //     }
            //     if (file) {
            //         // setTempAvatar(URL.createObjectURL(file)); // Set temporary avatar preview
            //         formData.append("avatar", file); // Append avatar if uploaded
            //     }

            if (tempAvatar) {
                const formData = new FormData();
                formData.append("username", username); // Append username
                formData.append("email", email);       // Append email
                if (password) {
                    formData.append("password", password); // Append password if provided
                }
    
                const fileInput = document.getElementById("avatarUpload");
                if (fileInput?.files?.[0]) {
                    formData.append("avatar", fileInput.files[0]); // Append the selected avatar file
                }
                
                // Log form data before sending
                console.log("FormData being sent:", formData);

                // Upload avatar to the backend
                const avatarResponse = await axios.put("/user/updateprofile", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                // Log the response from the backend
                console.log("Avatar Upload Response:", avatarResponse.data);

                 // Update avatar URL
                avatarUrl = `http://localhost:5000${avatarResponse.data.avatarUrl}`;
            }

            // Update user profile details (username, email, password, and avatar)
            const response = await axios.put("/user/updateprofile", {
                username,
                email,
                password: password || undefined, // Don't send the password if it's empty
                avatar: avatarUrl, // Send updated avatar URL to the backend
            });

            // Log the profile update response
            console.log("Profile Update Response:", response.data);

            if (response.data.success) {
                const updatedUser = response.data.user;

                // Update user context and ensure avatar is updated properly
                setUser((prevUser) => ({
                    ...prevUser,
                    ...updatedUser,
                    avatar: updatedUser.avatar || prevUser.avatar, // Fallback to existing avatar if not updated
                }));

                setTempAvatar(null); // Clear temporary avatar
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile.");
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
                            {tempAvatar || avatar ? (
                                <img
                                    src={tempAvatar || avatar}
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
                            onChange={handleAvatarChange}
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
