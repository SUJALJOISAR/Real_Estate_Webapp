import { Router } from "express";
import { getUserProfile, logout, register, signin } from "../controllers/authcontroller.js";
import { authenticateToken, registerValidation, siginValidation } from "../utils/validator.js";

const authRouter=Router();

authRouter.post('/register',registerValidation,register);
authRouter.post('/signin',siginValidation,signin);
authRouter.get('/getUser',authenticateToken,getUserProfile);
authRouter.get('/logout',logout);

export default authRouter;