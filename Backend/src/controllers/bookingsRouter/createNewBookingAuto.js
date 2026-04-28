const Booking = require("../../models/bookings");
const User = require("../../models/users");
const validateFields = require("../../utils/validateFields");
const { buildSeatAllocationPrompt } = require("../../utils/generatePromptForAI");
const { generateSeatNo } = require("../../services/aiService");

const createNewBookingAuto = async (req, res) => {
    try {
        
        // validate fields
        validateFields.bookingAuto(req.body);

        // extracting fields 
        const { userId, shift, startDate, endDate } = req.body;

        // later this should be taken from auth middleware if user is creating booking for self
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
        const activeBookings = await Booking.find({
            endDate: { $gte: start },
            shift: { $in: shiftQuery },
        });

        const prompt = buildSeatAllocationPrompt(activeBookings, shift, startDate, endDate);

        const { seatNo } = await generateSeatNo(prompt);

        // I am sure that given seat no by AI is available, in future also write a logic to check it 
        // while(exists)
        // if(exists)
        //     return res.status(400).json({ status: "failed", message: "Seat is not available, try again"});

        console.log("AI suggested seat no: ", seatNo);
        // logic could be improved in future
        const exists = await Booking.exists({
            endDate: { $gte: start },
            shift: { $in: shiftQuery },
            seatNo: seatNo
        });

        if(exists)
            return res.status(400).json({ status: "failed", message: "Seat is already booked"});

        req.body.user = userId;
        req.body.seatNo = seatNo;
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

module.exports = createNewBookingAuto;