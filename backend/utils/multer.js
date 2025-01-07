import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

// Get the directory name of the current file (using ES module syntax)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage for listing images
const listingStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user.id; // Extract userId from the request (ensure req.user is populated via middleware)
        const username = req.user.username;
        const userFolder = path.join(__dirname, "../uploads", `${userId}-${username}-images`);

        // Ensure the user's folder exists
        fs.mkdirSync(userFolder, { recursive: true });

        cb(null, userFolder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});


// Configure multer storage
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../user-images"), // Folder where avatars will be stored
    filename: (req, file, cb) => {
        // Create a unique filename based on the current timestamp and original file name
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

// Set up multer with the defined storage configuration
export const upload = multer({ storage });
export const uploadListingImages = multer({storage:listingStorage});




