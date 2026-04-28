const Attendance = require("../../models/attendance");

const fetchAttendanceForAllUsers = async (req, res) => {
    try {
        const { date } = req.query; // format: "2024-02-28"

        if(date === undefined) {
            return res.status(400).json({
                message: "Date query parameter is required",
                status: "failed"
            });
        }

        // --- FIX STARTS HERE ---
        
        // 1. Manually parse the date string parts
        // "2024-02-28" -> [2024, 2, 28]
        const [year, month, day] = date.split('-').map(Number);

        // 2. Create a Date object using the Server's Local Time constructor
        // Note: Month is 0-indexed in JS (0 = Jan, 1 = Feb)
        const searchDate = new Date(year, month - 1, day);
        
        // 3. Ensure it is explicitly set to 00:00:00:000 Local Time
        // This matches exactly what you did in markAttendance: 'today.setHours(0, 0, 0, 0)'
        searchDate.setHours(0, 0, 0, 0);

        // 4. (Recommended) Use a range query just in case milliseconds differ slightly
        // But since you want to match your storage logic, we can try exact match first.
        // However, a range query is ALWAYS safer in MongoDB.
        
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const attendanceRecords = await Attendance.find({ 
            date: {
                $gte: searchDate, // Greater than or equal to start of local day
                $lt: nextDay      // Less than start of next local day
            }
        })
        // --- FIX ENDS HERE ---
        
            .populate({
                path: "user",
                select: "_id username contactNo", 
            })  
            .populate({
                path: "booking",
                select: "_id seatNo shift", 
            })  
            .sort({ timeIn: -1 });  

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

module.exports = fetchAttendanceForAllUsers;