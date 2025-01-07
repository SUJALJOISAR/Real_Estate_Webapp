import { Router } from "express";
import { createListing } from "../controllers/listingcontroller.js";
import { authenticateToken } from "../utils/validator.js";
import { uploadListingImages } from "../utils/multer.js";

const listingRouter = Router();

// Route to create a listing with image upload
listingRouter.post('/createListing',authenticateToken,uploadListingImages.array('images',6),createListing);
  
  export default listingRouter;