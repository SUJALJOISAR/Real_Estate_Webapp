import { validationResult } from "express-validator";
import { hash } from "bcrypt";
import { connectDatabase } from "../db/connection.js";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("body:", req.body);
    const userId = req.user.id; // Assuming the user ID is in the token or session

    // 1. Input Validation (using express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation failed",
        errors: errors.array(),
      });
    }

    // 2. Check Required Fields (validate that fields are not empty)
    if (!username || !email) {
      return res.status(400).json({
        success: false,
        msg: "Username and Email are required",
      });
    }

    // 3. Handle Avatar Upload
    let avatarUrl = null;
    if (req.file) {
      const avatarName = `${Date.now()}-${req.file.originalname}`;
      avatarUrl = `/user-images/${avatarName}`;
      const uploadPath = path.join(__dirname, "../user-images", avatarName);
      fs.renameSync(req.file.path, uploadPath);
    }

    console.log(req.user);

    // 4. Connect Database
    const db = await connectDatabase();

    // 5. Check if the email is already taken by another user (except for the current user)
    const checkUserQuery = `SELECT * FROM users WHERE email = ? AND id != ?`;
    db.query(checkUserQuery, [email, userId], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: "Database query error",
        });
      }

      if (result.length > 0) {
        return res.status(409).json({
          success: false,
          msg: "Email is already in use",
        });
      }

      // 6. Hash the password if it's provided
      let hashedPassword;
      if (password) {
        hashedPassword = await hash(password, 10);
      }

      // 7. Update the user in the database
      // The COALESCE function is used to avoid updating the password if no new password is provided.
      const updateUserQuery = `
       UPDATE users
       SET username = ?, email = ?, password = COALESCE(?, password),avatar = COALESCE(?, avatar)
       WHERE id = ?
     `;
      db.query(
        updateUserQuery,
        [username, email, hashedPassword, avatarUrl, userId],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              msg: "Error updating user",
            });
          }

          // Fetch the avatar URL from the database
          const getUserQuery = `SELECT  username, email,avatar FROM users WHERE id = ?`;
          db.query(getUserQuery, [userId], (err, result) => {
            if (err) {
              return res.status(500).json({
                success: false,
                msg: "Error fetching avatar",
              });
            }

            const updatedUser = result[0];
            const updatedAvatarUrl = `http://localhost:5000${updatedUser.avatar}`;

            // 7. Generate updated JWT token
            const updatedToken = jwt.sign(
              {
                id: userId,
                email: updatedUser.email,
                username: updatedUser.username,
                avatar: updatedAvatarUrl,
              },
              process.env.JWT_SECRET,
              { expiresIn: "1d" } // Token expiration
            );

            // 8. Send the updated token to the client
            res.cookie(process.env.COOKIE_NAME, updatedToken, {
              path: "/",
              httpOnly: true,
              secure: true,
              signed: true,
              sameSite: "None",
              maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            // 7. Return updated user information
            return res.status(200).json({
              success: true,
              msg: "Profile updated successfully",
              user: {
                id: userId,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedAvatarUrl,
              },
            });
          });
        }
      );
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const googleAvatarUpload = async (req,res) =>{
  
}
