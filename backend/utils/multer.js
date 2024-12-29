const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure multer for storing images in user-images folder
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../user-images"), // Set destination folder
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });
  
  const upload = multer({ storage });
  