import { validationResult } from "express-validator";
import { connectDatabase } from "../db/connection.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Input Validation (using express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation failed",
        errors: errors.array(),
      });
    }

    //2. Check Required Fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: "All Fields Required",
      });
    }

    //3. Connect Database
    const db = await connectDatabase();

    //4. Check if user already registered
    const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(checkUserQuery, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: "Database query Error",
        });
      }

      if (result.length > 0) {
        return res.status(409).json({
          success: false,
          msg: "User Already Registered",
        });
      }

      //5.Hash the password
      const hashedPassword = await hash(password, 10);

      //6. Insert user into database
      const insertUserQuery = `INSERT INTO users (username,email,password) VALUES (?,?,?)`;
      db.query(insertUserQuery, [username, email, hashedPassword], (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            msg: "Error Creating User",
          });
        }

        //Success Response
        return res.status(201).json({
          success: true,
          msg: "User Registered Successfully",
          user: {
            username: username,
            email: email,
          },
        });
      });
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //1.Input validation  (using express.validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation failed",
        errors: errors.array(),
      });
    }

    //2.Check Required Fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Both email and password are required",
      });
    }

    // 3.Connect Database
    const db = await connectDatabase();

    // 4. Check if the user exists in the database
    const findUserQuery = `SELECT *  FROM users WHERE email = ?`;
    db.query(findUserQuery, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: "Database query error",
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          msg: "Invalid email or password",
        });
      }

      //   5. Compare password
      const user = result[0];
      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          msg: "Invalid email or password",
        });
      }
      // console.log("from backend login",user);

      //   6.Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } //Token expiration
      );

      // 7. Construct Avatar URL
      const avatarUrl = user.avatar
        ? `http://localhost:5000${user.avatar}` // Assuming avatar in database is already stored with `${Date.now()}-${originalname}`
        : null;

      // 7. Success Response
      res.cookie(process.env.COOKIE_NAME, token, {
        path: "/",
        httpOnly: true,
        secure: true,
        signed: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(200).json({
        success: true,
        msg: "Sign-in successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: avatarUrl, // Include the avatar URL
        },
      });
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const getUserProfile = (req, res) => {
  try {
    const { id, email, username, avatar } = req.user;

    if (!id || !email || !username) {
      return res.status(400).json({
        success: false,
        msg: "User data is incomplete or invalid.",
      });
    }

    // Successful response with user data
    return res.status(200).json({
      success: true,
      msg: "User profile fetched successfully.",
      user: {
        id,
        email,
        username,
        avatar,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error while fetching user profile.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const cookie = process.env.COOKIE_NAME;
    console.log("Clearing cookie: ", cookie); // Log cookie name
    res.clearCookie(cookie);
    return res.status(200).json({
      msg: "User logout Successfully!!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};
