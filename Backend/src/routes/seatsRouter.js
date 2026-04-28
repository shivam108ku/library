const express = require("express");
const seatsRouter = express.Router();
const getAllSeatsDetails = require("../controllers/seatsRouter/getAllSeatsDetails");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const getAllBookingsBySeatNo = require("../controllers/seatsRouter/getAllBookingsBySeatNo");

seatsRouter.get("/list", verifyToken, isAdmin, getAllSeatsDetails);
seatsRouter.get("/bookings/:seatNo", verifyToken, isAdmin, getAllBookingsBySeatNo);

module.exports = seatsRouter;