import { connectDatabase } from "../db/connection.js";
import fs from 'fs';
import path from 'path';

export const createListing = async (req, res) => {
    try {
        const userId=req.user.id;
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

    console.log("Request body:",req.body);

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
     if (typeof parsedType !== "object" || (!parsedType.sell && !parsedType.rent)) {
        return res.status(400).json({
          message: "Type must be a valid JSON object with sell or rent as true",
        });
      }

    //validate discount price
    if (offer && (discountPrice <= 0 || discountPrice >= regularPrice)) {
      return res
        .status(400)
        .json({
          message:
            "Discount price must be valid and less than the regular price",
        });
    }

     // Process uploaded images
     const imagePaths = req.files.map((file) => {
        return `/uploads/${userId}-${username}-images/${file.filename}`;
    });

    //Insert listing into the database
    const query = `INSERT INTO listings(name,description,address,type,offer,bedrooms,bathrooms,regular_price,discount_price,parking,furnished,image_urls) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
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
    ];

    const db = await connectDatabase();

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({
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
        type:parsedType,
        offer,
        bedrooms,
        bathrooms,
        regularPrice,
        discountPrice,
        parking,
        furnished,
        images:imagePaths,
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
