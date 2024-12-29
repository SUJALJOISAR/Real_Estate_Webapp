import {Router} from "express";
import { uploadAvatar } from "../controllers/usercontroller.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appRouter =Router();

// Configure multer for storing images
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../user-images"), // Destination folder
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });
  
  const upload = multer({ storage });
  
  // Define the route for uploading avatar
  appRouter.post("/uploadavatar", upload.single("avatar"), uploadAvatar);

export default appRouter;