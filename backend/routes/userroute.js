import { Router } from "express";
import { updateProfile } from "../controllers/usercontroller.js"; // Controller for handling avatar upload
import upload from "../utils/multer.js"; // Import multer configuration
import { authenticateToken } from "../utils/validator.js";

const appRouter = Router();

// Define the route for uploading avatar
// appRouter.post("/uploadavatar",authenticateToken,uploadAvatar);
appRouter.put('/updateprofile',authenticateToken,upload.single("avatar"),updateProfile);

export default appRouter;
