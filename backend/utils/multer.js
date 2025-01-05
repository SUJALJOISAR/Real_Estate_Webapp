import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current file (using ES module syntax)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const upload = multer({ storage });

export default upload;
