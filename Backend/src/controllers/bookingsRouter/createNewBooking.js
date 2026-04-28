const Booking = require("../../models/bookings");
const User = require("../../models/users");
const validateFields = require("../../utils/validateFields");

const createNewBooking = async (req, res) => {
    try {
        
        // validate fields
        validateFields.booking(req.body);

        // extracting fields 
        const { userId, seatNo, shift, startDate } = req.body;

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ status: "failed", message: "User does not exist"});
        }
        
        const shiftQuery = shift === "fullday"
        ? ["fullday", "first", "second"]
        : shift === "first"
            ? ["fullday", "first"]
            : ["fullday", "second"];

        // Convert startDate to start of the day (midnight) to compare only date
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);

        // logic could be improved in future
        const exists = await Booking.exists({
            endDate: { $gte: startDate },
            shift: { $in: shiftQuery },
            seatNo: seatNo
        });

        if(exists)
            return res.status(400).json({ status: "failed", message: "Seat is already booked"});
        
        req.body.payment.lastUpdated = new Date();
        req.body.user = userId;
        const newBooking = await Booking.create(req.body);

        res.status(201).json({
            booking: newBooking,
            status: "ok",
            message: "New booking created successfully"
        });
    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ 
            status: "failed",
            error: error.message || "Internal server error"
        });

    }

};

module.exports = createNewBooking;