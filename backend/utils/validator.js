import { body } from "express-validator";

export const registerValidation = [
    body('username').notEmpty().withMessage('Username must not be empty'),
    body('email').isEmail().withMessage('Email must not be empty'),
    body('password').isLength({min:4,max:6}).withMessage('Password must be at least 4 characters')
];

export const siginValidation = [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
]