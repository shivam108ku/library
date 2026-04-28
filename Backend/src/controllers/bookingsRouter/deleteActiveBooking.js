const mongoose = require("mongoose");
const Booking = require("../../models/bookings");       // Adjust path as needed
const Attendance = require("../../models/attendance"); // Adjust path as needed

const deleteActiveBooking = async (req, res) => {
    const { bookingId } = req.params;

    return res.status(400).json({ message: "Delete Booking API is under maintenance" });

    // 1. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({ message: "Invalid Booking ID format" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2. Check if booking exists
        const booking = await Booking.findById(bookingId).session(session);
        
        if (!booking) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Booking not found" });
        }

        // 3. Delete related Attendance records
        // We find all attendance docs where the 'booking' field matches our ID
        const deletedAttendance = await Attendance.deleteMany({ booking: bookingId }).session(session);

        // 4. Delete the Booking itself
        await Booking.findByIdAndDelete(bookingId).session(session);

        // 5. Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Booking and related attendance records deleted successfully",
            details: {
                bookingId: bookingId,
                attendanceRecordsDeleted: deletedAttendance.deletedCount
            }
        });

    } catch (error) {
        // Rollback changes on error
        await session.abortTransaction();
        session.endSession();

        console.error("Delete Booking Error:", error);
        return res.status(500).json({ 
            message: "Server error while deleting booking", 
            error: error.message 
        });
    }
};

module.exports = deleteActiveBooking;