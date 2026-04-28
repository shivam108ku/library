const Booking = require("../../models/bookings");

const getAllSeatsDetails = async (req, res) => {
    try {
        console.log("prem")
        // get today's date at midnight
        const today = new Date();
        console.log(today)
        today.setUTCHours(0, 0, 0, 0);
        console.log(today)

        // fetch all seats whose booking end date is today or in future
        const seats = await Booking.find({
            endDate: { $gte: today }
        }).populate("user");

        return res.status(200).json({
            seats,
            status: "ok",
            message: "Seats fetched successfully"
        });

    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: "failed",
            error: error.message || "Internal server error"
        });
    }
};

module.exports = getAllSeatsDetails;
