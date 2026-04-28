const Booking = require("../../models/bookings");
const validateFields = require("../../utils/validateFields");

const createNewBooking = async (req, res) => {
    try {
        const { amount, method, notes } = req.body;
        const { bookingId } = req.params;

        // validate fields
        validateFields.payment({amount, bookingId});

        const booking = await Booking.findById(bookingId);

        if(!booking) {
            return res.status(404).json({ status: "failed", message: "Booking does not exist"});
        }
        
        booking.payment.status = "paid";
        booking.payment.amount = amount;
        booking.payment.lastUpdated = new Date();
        booking.payment.method = method || "cash";
        if(notes)
            booking.notes = notes;

        await booking.save();

        res.status(200).json({
            status: "ok",
            message: "Payment updated successfully"
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