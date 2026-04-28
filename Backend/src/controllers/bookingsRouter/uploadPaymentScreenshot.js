const Booking = require("../../models/bookings");
const { uploadToGoogleDrive } = require("../../services/googleDriveService");
const mongoose = require("mongoose");

const uploadPaymentScreenshot = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // 1. Check if file exists
        if (!req.file) {
            return res.status(400).json({ status: "failed", message: "No file uploaded" });
        }

        if(!bookingId)
            return res.status(400).json({ status: "failed", message: "Booking ID is required" });

        if(!mongoose.Types.ObjectId.isValid(bookingId))
            return res.status(400).json({ status: "failed", message: "Invalid Booking ID" });

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ status: "failed", message: "Booking not found" });
        }

        // 2. Upload to Google Drive
        const publicUrl = await uploadToGoogleDrive(req.file, 'payment_screenshot');

        // 3. Update Booking in DB
        booking.payment.status = "pending";
        booking.payment.screenshotUrl = publicUrl;
        booking.payment.lastUpdated = new Date();

        await booking.save();

        res.status(200).json({
            status: "ok",
            booking,
            message: "Payment screenshot uploaded successfully"
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({
            status: "failed",
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports = uploadPaymentScreenshot;