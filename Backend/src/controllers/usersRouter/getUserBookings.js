const Booking = require("../../models/bookings");
const mongoose = require("mongoose");

const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params; 
        
        if(!userId) {   
            return res.status(400).json({   
                status: "failed",
                message: "User ID is required"
            });
        }   

        // checking if userId is of valid mongodb object type
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid userId given"
            }); 
        } 
    
        // fetch bookings for the user
        const bookings = await Booking.find({ user: userId });

        return res.status(200).json({
            bookings,
            status: "ok",
            message: "Bookings fetched successfully"
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

module.exports = getUserBookings;