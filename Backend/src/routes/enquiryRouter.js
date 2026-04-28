const express = require("express");
const enquiryRouter = express.Router();
const enquiryController = require("../controllers/enquiryController");
const createNewEnquiry = require("../controllers/enquiryRouter/createNewEnquiry"); // Your existing student-side controller

// Student Side
enquiryRouter.post("/add", createNewEnquiry);

// Admin Side
enquiryRouter.get("/list", enquiryController.getAllEnquiries);
enquiryRouter.delete("/:id", enquiryController.deleteEnquiry);

module.exports = enquiryRouter;