const Booking = require("../../models/bookings");
const mongoose = require("mongoose");

const createNewBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if(!bookingId)
            throw new CustomError("bookingId is not given", 400);

        // checking if bookingId is of valid mongodb object type
        if (!mongoose.Types.ObjectId.isValid(bookingId)) 
            throw new CustomError("Invalid bookingId given", 400);

        const booking = await Booking.findById(bookingId);

        if(!booking) {
            return res.status(404).json({ status: "failed", message: "Booking does not exist"});
        }
        
        booking.payment.status = "unpaid";
        booking.payment.method = null;
        booking.payment.lastUpdated = new Date();

        await booking.save();

        res.status(200).json({
            status: "ok",
            message: "Payment deleted successfully"
        });
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ 
            status: "failed",
            error: error.message || "Internal server error"
        });

    }

};

module.exports = createNewBooking;