import { connectDatabase } from "../db/connection.js";
import fs from "fs";
import path, { resolve } from "path";
import { fileURLToPath } from "url";

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createListing = async (req, res) => {
  try {
    const userId = req.user.id;
    const username = req.user.username;

    const {
      name,
      description,
      address,
      type, //JSON Object: {sell:true/false, rent:true/false}
      offer,
      bedrooms,
      bathrooms,
      regularPrice,
      discountPrice,
      parking,
      furnished,
    } = req.body;

    console.log("Request body:", req.body);

    // Parse type if it is a string
    let parsedType;
    try {
      parsedType = typeof type === "string" ? JSON.parse(type) : type;
    } catch (err) {
      return res.status(400).json({ message: "Invalid JSON format for type" });
    }

    //validate the fields
    if (
      !name ||
      !description ||
      !address ||
      !type ||
      bedrooms < 1 ||
      bathrooms < 1 ||
      regularPrice < 0
    ) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // Validate type
    if (
      typeof parsedType !== "object" ||
      (!parsedType.sell && !parsedType.rent)
    ) {
      return res.status(400).json({
        message: "Type must be a valid JSON object with sell or rent as true",
      });
    }

    //validate discount price
    if (offer === 0 && (discountPrice <= 0 || discountPrice >= regularPrice)) {
      return res.status(400).json({
        message: "Discount price must be valid and less than the regular price",
      });
    }

    // Process uploaded images
    const imagePaths = req.files.map((file) => {
      return `/uploads/${userId}-${username}-images/${file.filename}`;
    });

    //Insert listing into the database
    const query = `INSERT INTO listings(name,description,address,type,offer,bedrooms,bathrooms,regular_price,discount_price,parking,furnished,image_urls,user_ref) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [
      name,
      description,
      address,
      JSON.stringify(type), //convert the type JSON object to string
      offer,
      bedrooms,
      bathrooms,
      regularPrice,
      discountPrice,
      parking,
      furnished,
      JSON.stringify(imagePaths), //save imagaes as JSON string
      userId,
    ];

    const db = await connectDatabase();

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          message: "An error occurred while creating the listing.",
          error: err,
        });
      }

      // Create the response object with all fields from the listing
      const newListing = {
        id: result.insertId,
        name,
        description,
        address,
        type: parsedType,
        offer,
        bedrooms,
        bathrooms,
        regularPrice,
        discountPrice,
        parking,
        furnished,
        images: imagePaths,
        userRef: userId,
      };

      res.status(201).json({
        message: "Listing created successfully!",
        listing: newListing,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred.", error });
  }
};

export const getUserListings = async (req, res) => {
  try {
    const userId = req.user.id;
    const username = req.user.username;

    //path to the user's images folder
    const userImagesPath = path.join(
      __dirname,
      `../uploads/${userId}-${username}-images`
    );

    if (!fs.existsSync(userImagesPath)) {
      return res
        .status(404)
        .json({ success: false, message: "No listings found for this user." });
    }

    //Get all images files in the folder
    const images = fs.readdirSync(userImagesPath);

    // Fetch listing details (like name) from the database
    const db = await connectDatabase();
    const query = `SELECT id, name, image_urls FROM listings WHERE user_ref = ?`;
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error." });
      }

      // Map over the listings and assign a random image
      const listings = results.map((listing) => {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        return {
          id: listing.id,
          name: listing.name,
          image: `http://localhost:5000/uploads/${userId}-${username}-images/${randomImage}`,
        };
      });

      return res.status(200).json({ success: true, listings });
    });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const deletelisting = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userName = req.user.username;

  const db = await connectDatabase();

  //Query to get the image file name of the listing
  const getImageQuery = `SELECT image_urls FROM listings WHERE id=? AND user_ref=?`;

  db.query(getImageQuery, [id, userId], (err, results) => {
    if (err) {
      console.error("Error fetching listing image data:", err);
      return res.status(500).json({
        success: false,
        message: "Database error while fetching image data.",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    console.log(results);

    //Parse the JSON array of image file names
    const imageUrls = results[0].image_urls;

    // Extract the folder path (assumes all images are in the same folder)
    const folderPath = path.join(
      __dirname,
      "..",
      path.dirname(imageUrls[0]) // Get folder path from the first image
    );

    //Delete all image files from the filesystem
    const deletePromises = imageUrls.map((imageName) => {
      const imagePath = path.join(__dirname, `..`, imageName);

      return new Promise((resolve, reject) => {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log("Error deleting image File:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    // Wait for all image deletions to complete
    Promise.allSettled(deletePromises)
      .then(() => {
        // After deleting all files, delete the folder
        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error("Error deleting folder:", err);
          } else {
            console.log("Folder deleted successfully:", folderPath);
          }
        });

        // Proceed to delete the listing from the database
        const deleteQuery =
          "DELETE FROM listings WHERE id = ? AND user_ref = ?";
        db.query(deleteQuery, [id, userId], (err, result) => {
          if (err) {
            console.error("Error deleting listing:", err);
            return res
              .status(500)
              .json({ success: false, message: "Database error." });
          }

          // Check if a listing was deleted
          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message:
                "Listing not found or you don't have permission to delete it.",
            });
          }

          return res.status(200).json({
            success: true,
            message: "Listing and associated images deleted successfully.",
          });
        });
      })
      .catch(() => {
        return res.status(500).json({
          success: false,
          message: "Error deleting one or more images.",
        });
      });
  });
};

export const getListing = async (req, res) => {
  try {
    const userId = req.user.id;
    const username = req.user.username;
    const listingId = req.params.id;

    // Path to the user's image folder
    const userImagesPath = path.join(
      __dirname,
      `../uploads/${userId}-${username}-images`
    );
    console.log(userImagesPath);

    // Check if images folder exists
    if (!fs.existsSync(userImagesPath)) {
      return res.status(404).json({
        success: false,
        message: "No images found for this user.",
      });
    }

    // Get all images files in the folder
    const images = fs.readdirSync(userImagesPath);

    const db = await connectDatabase();
    const query = `SELECT * FROM listings WHERE user_ref = ? AND id = ?`;

    return new Promise((resolve, reject) => {
      db.query(query, [userId, listingId], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            success: false,
            message: "Database error occurred while fetching the listing.",
          });
        }

        // If no listing found for the user with the provided id
        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Listing not found for this user.",
          });
        }

        const listing = results[0];
        // Map over the listings and return all images
        const allImages = images.map((image) => {
          return `http://localhost:5000/uploads/${userId}-${username}-images/${image}`;
        });

        return res.status(200).json({
            success: true,
            listing: {
              id: listing.id,
              name: listing.name,
              description: listing.description,
              address: listing.address,
              type: listing.type,
              offer: listing.offer,
              bedrooms: listing.bedrooms,
              bathrooms: listing.bathrooms,
              regularPrice: listing.regularPrice,
              discountPrice: listing.discountPrice,
              parking: listing.parking,
              furnished: listing.furnished,
              images: allImages, // All images related to the listing
            },
          });
      });
    });
  } catch (error) {
    console.error("Error in getListing controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while fetching the listing details.",
    });
  }
};

export const updateListing = async (req, res) => {};
