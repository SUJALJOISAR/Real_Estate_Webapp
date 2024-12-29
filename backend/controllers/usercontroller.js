// Controller to handle avatar upload
export const uploadAvatar = async (req, res) => {
    try {
      // Check if file exists
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      // Construct the avatar URL (path relative to the server)
      const avatarUrl = `/user-images/${req.file.filename}`;
  
      // Simulate saving the avatar URL in the database (if needed)
      // You can replace this with actual database logic
      // Example: await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl });
  
      return res.status(200).json({ avatarUrl });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  