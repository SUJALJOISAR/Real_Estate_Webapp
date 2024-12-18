import { validationResult } from "express-validator";
import { connectDatabase } from "../db/connection.js";
import { hash } from "bcrypt";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

      // 1. Input Validation (using express-validator)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          msg: 'Validation failed',
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
      db.query(insertUserQuery, [
        username,
        email,
        hashedPassword],
        (err) => {
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
              username:username,
              email:email,
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
