const Attendance = require("../../models/attendance");
const User = require("../../models/users");

const fetchAttendance = async (req, res) => {
    try {
        const userId = req.payload.userId || req.params.userId; // from token or URL param

        // check if user exists
        const userExists = await User.exists({ _id: userId });  // using exists for a lightweight check
        if (!userExists) {
            return res.status(404).json({
                message: "User not found",
                status: "failed"
            });
        }

        // fetching attendance records for the user
        const attendanceRecords = await Attendance.find({ user: userId })
            .populate({
                path: "booking",
                select: "_id seatNo shift", // only these fields will be populated
            })
            .sort({ date: -1 });


        return res.status(200).json({
            attendanceRecords,
            message: "Attendance records fetched successfully",
            status: "ok"
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

module.exports = fetchAttendance;