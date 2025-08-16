const express = require("express");
const router = express.Router();
const { 
    createCause, 
    getAllCauses, 
    getSingleCause, 
    donateToCause, 
    deleteCause
} = require("../controllers/causeContoller");
const { 
    verifyTokenAndOnlyAdmin, 
    verifyToken 
} = require("../middelware/verifyToken");    
const cloudinaryUpload = require("../middelware/photoStorage");

// /api/causes
router.route("/")
    .post(verifyTokenAndOnlyAdmin, cloudinaryUpload.single("image"), createCause) 
    .get(getAllCauses); 

// /api/causes/:id
router.route("/:id")
    .get(getSingleCause)
    .delete(verifyTokenAndOnlyAdmin, deleteCause);

// /api/causes/donate/:id
router.route("/donate/:id")
    .post(verifyToken, donateToCause); 

module.exports = router;