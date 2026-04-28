const express = require("express");
const dashboardRouter = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const getDashboardStats = require("../controllers/dashboardRouter/getDashboardStats");

dashboardRouter.get("/stats", verifyToken, isAdmin, getDashboardStats);

module.exports = dashboardRouter;