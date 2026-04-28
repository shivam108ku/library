const User = require("../../models/users");
const Booking = require("../../models/bookings");
const Attendance = require("../../models/attendance");

const markAttendance = async (req, res) => {
    try {
        const { userId } = req.body;

        // check if user exists
        const user = await User.findById(userId).select("_id username")  // later you can use select to get specific fields
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: "failed"
            });
        }

        // checking if user has an active booking
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // set to midnight for accurate date comparison

        const activeBooking = await Booking.findOne({ 
            user: userId,
            startDate: { $lte: today },
            endDate: { $gte: today }
        });                                 // later you can use select to get specific fields

        if (!activeBooking) {
            return res.status(400).json({
                message: "No active booking found for the user",
                status: "failed",
                statusCode: 1001          // 1001 - No active booking
            });
        }

        // checking if attendance is already marked for today
        const existingAttendance = await Attendance.findOne({
            user: userId,
            booking: activeBooking._id,
            date: today
        });
        if (existingAttendance) {
            if(existingAttendance.timeOut) {
                return res.status(400).json({
                    user,
                    booking: activeBooking,
                    existingAttendance,
                    message: "Attendance already marked for today",
                    status: "failed",
                    statusCode: 1002          // 1002 - Attendance already marked
                });
            } 

            // mark timeOut
            existingAttendance.timeOut = new Date();
            await existingAttendance.save();    

            return res.status(200).json({
                user,
                booking: activeBooking,
                existingAttendance,
                message: "Time out marked successfully",
                status: "ok",
                statusCode: 1003          // 1003 - Time out marked
            });
        } 

        // mark timeIn
        const newAttendance = await Attendance.create({
            user: userId,
            booking: activeBooking._id,
            date: today,
            timeIn: new Date()
        });

        return res.status(200).json({
            user,
            booking: activeBooking,
            newAttendance,
            message: "Time in marked successfully",
            status: "ok",
            statusCode: 1004          // 1004 - Time in marked
        });

    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || 500;     

        res.status(statusCode).json({
            message: error.message,
            status: "failed"
        });
    }
}

module.exports = markAttendance;