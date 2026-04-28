const mongoose = require("mongoose");
const User = require("../../models/users"); // Adjust path to your User model
const Booking = require("../../models/bookings"); // Adjust path to your Booking model
const Attendance = require("../../models/attendance"); // Adjust path to your Attendance model

const deleteUserAndRelatedData = async (req, res) => {
    const { userId } = req.params;

    // 1. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Start a session for a Transaction (Best practice for cascading deletes)
    // If one deletion fails, everything rolls back.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2. Check if user exists
        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "User not found" });
        }

        // OPTIONAL: Logic to delete physical files (profilePhotoUrl) from AWS S3 or Local Storage would go here.

        // 3. Delete related data
        // We delete Bookings and Attendance where the 'user' field matches the ID
        const deletedBookings = await Booking.deleteMany({ user: userId }).session(session);
        const deletedAttendance = await Attendance.deleteMany({ user: userId }).session(session);

        // 4. Delete the User
        await User.findByIdAndDelete(userId).session(session);

        // 5. Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "User and all related data deleted successfully",
            details: {
                userDeleted: true,
                bookingsDeleted: deletedBookings.deletedCount,
                attendanceRecordsDeleted: deletedAttendance.deletedCount
            }
        });

    } catch (error) {
        // If anything fails, roll back changes
        await session.abortTransaction();
        session.endSession();
        
        console.error("Delete User Error:", error);
        return res.status(500).json({ 
            message: "Server error while deleting user", 
            error: error.message 
        });
    }
};

module.exports = deleteUserAndRelatedData;