import { body } from "express-validator";
import jwt from 'jsonwebtoken';

export const registerValidation = [
  body("username").notEmpty().withMessage("Username must not be empty"),
  body("email").isEmail().withMessage("Email must not be empty"),
  body("password")
    .isLength({ min: 4, max: 6 })
    .withMessage("Password must be at least 4 characters"),
];

export const siginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const authenticateToken = async (req, res, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME;
    const token = req.signedCookies[cookieName];

    if(!token){
        return res.status(401).json({ message: "Unauthorized",success:false });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    next();
  } catch (error) {
    console.error("Token verification error: ", error); // Log error details
    return res.status(401).json({
      msg: "Token is not valid",
      success: false,
    });
  }
};
