import { Router } from "express";
import { register, signin } from "../controllers/authcontroller.js";
import { registerValidation, siginValidation } from "../utils/validator.js";

const authRouter=Router();

authRouter.post('/register',registerValidation,register);
authRouter.post('/signin',siginValidation,signin);

export default authRouter;