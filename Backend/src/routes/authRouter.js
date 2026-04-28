const express = require("express");
const createNewAdmin = require("../controllers/authRouter/createNewAdmin");
const loginAdmin = require("../controllers/authRouter/loginAdmin");
const verifyToken = require("../middlewares/verifyToken");
const isOwner = require("../middlewares/isOwner");
const logoutAdmin = require("../controllers/authRouter/logoutAdmin");
const sendAdminBasicDetails = require("../controllers/authRouter/sendAdminBasicDetails");
const authRouter = express.Router();


// For Admins
// authenticating admin
authRouter.get("/admin/check", verifyToken, sendAdminBasicDetails);

// admin login
authRouter.post("/admin/login", loginAdmin);

// admin logout
authRouter.post("admin/logout", verifyToken, logoutAdmin);

// registering new admin
authRouter.post("/admin/register", verifyToken, isOwner, createNewAdmin);

module.exports = authRouter;