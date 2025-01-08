import { Router } from "express";
import { createListing, deletelisting, getListing, getUserListings, updateListing } from "../controllers/listingcontroller.js";
import { authenticateToken } from "../utils/validator.js";
import { uploadListingImages } from "../utils/multer.js";

const listingRouter = Router();

// Route to create a listing with image upload
listingRouter.post('/createListing',authenticateToken,uploadListingImages.array('images',6),createListing);
listingRouter.get('/getlistings',authenticateToken,getUserListings);
listingRouter.delete('/deletelisting/:id',authenticateToken,deletelisting);
listingRouter.put('/updateListing/:id',authenticateToken,updateListing);
listingRouter.get('/getListing/:id',authenticateToken,getListing);
  export default listingRouter;