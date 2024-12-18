import { Router } from "express";
import { register } from "../controllers/authcontroller.js";
import { registerValidation } from "../utils/validator.js";

const authRouter=Router();

authRouter.post('/register',registerValidation,register);

export default authRouter;