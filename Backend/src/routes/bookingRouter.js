const express = require("express");
const bookingRouter = express.Router();
const createNewBooking = require("../controllers/bookingsRouter/createNewBooking");
const createNewBookingAuto = require("../controllers/bookingsRouter/createNewBookingAuto");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const makePayment = require("../controllers/bookingsRouter/makePayment");
const deletePayment = require("../controllers/bookingsRouter/deletePayment");
const deleteActiveBooking = require("../controllers/bookingsRouter/deleteActiveBooking");
const uploadPaymentScreenshot = require("../controllers/bookingsRouter/uploadPaymentScreenshot");
const getBookingsWithPagination = require("../controllers/bookingsRouter/getBookingsWithPagination");
const editBooking = require("../controllers/bookingsRouter/editBooking");
const fetchPaymentsByDate = require("../controllers/bookingsRouter/fetchPaymentsByDate");
const renewBooking = require("../controllers/bookingsRouter/renewBooking");
const upload = require("../config/multer");

// to get bookings with pagination recent first order
bookingRouter.get("/list", verifyToken, isAdmin, getBookingsWithPagination);

// to create new booking
bookingRouter.post("/add", verifyToken, createNewBooking);

// to create new booking auto - allot seat automatically using ai suggestion
bookingRouter.post("/add-auto", verifyToken, createNewBookingAuto);

// to renew booking
bookingRouter.post("/renew", verifyToken, renewBooking);

// to renew booking - admin route
bookingRouter.post("/renew/admin", verifyToken, isAdmin, (req, _, next) => { req.payload.userId = req.body.userId; req.payload.method = "admin"; next(); }, renewBooking);

// to delete active booking
bookingRouter.delete("/:bookingId", verifyToken, isAdmin, deleteActiveBooking);

// to set status paid of booking
bookingRouter.patch("/:bookingId/pay", verifyToken, isAdmin, makePayment); 

// to set status unpaid of booking
bookingRouter.delete("/:bookingId/pay", verifyToken, isAdmin, deletePayment); 

// to edit booking details
bookingRouter.put("/:bookingId", verifyToken, isAdmin, editBooking); 

// to fetch payments by date
bookingRouter.get("/payments", verifyToken, isAdmin, fetchPaymentsByDate);

// Use 'paymentSreenshot' as the key, consistent with frontend
bookingRouter.post("/:bookingId/payment-screenshot/upload", verifyToken, upload.single("paymentScreenshot"), uploadPaymentScreenshot);

module.exports = bookingRouter;