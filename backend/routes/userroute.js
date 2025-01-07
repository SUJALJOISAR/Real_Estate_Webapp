import { Router } from "express";
import { deleteAccount, updateProfile } from "../controllers/usercontroller.js"; // Controller for handling avatar upload
import {upload}  from "../utils/multer.js";
import { authenticateToken } from "../utils/validator.js";

const appRouter = Router();


appRouter.put('/updateprofile',authenticateToken,upload.single("avatar"),updateProfile);
appRouter.delete('/deleteAccount',authenticateToken,deleteAccount);

export default appRouter;
