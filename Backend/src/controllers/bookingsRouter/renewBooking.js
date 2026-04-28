const mongoose = require("mongoose");
const Booking = require("../../models/bookings");
const User = require("../../models/users");

const renewBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.payload;

        if (!userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "User ID is required",
                status: "failed"
            });
        }

        // check if user exists
        const user = await User
            .findById(userId)
            .select("_id username")
            .session(session);

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: "User not found",
                status: "failed"
            });
        }

        // checking if user has an active booking
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const activeBooking = await Booking.findOne({
            user: userId,
            startDate: { $lte: today },
            endDate: { $gte: today }
        }).session(session);

        if (!activeBooking) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "No active booking found for the user",
                status: "failed",
                statusCode: 1001
            });
        }

        // create new booking for next month
        const newStartDate = new Date(activeBooking.endDate);
        newStartDate.setDate(newStartDate.getDate() + 1);

        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newEndDate.getDate() + 30);

        const payment = {
            status: "unpaid",
            lastUpdated: new Date(),
            amount: activeBooking.payment.amount,
        };

        const newBooking = new Booking({
            user: userId,
            startDate: newStartDate,
            endDate: newEndDate,
            seatNo: activeBooking.seatNo,
            shift: activeBooking.shift,
            payment,
            renewal: {
                renewedFrom: activeBooking._id
            }
        });

        await newBooking.save({ session });

        // update the old booking
        activeBooking.renewal.isRewewed = true;   // typo kept as-is
        activeBooking.renewal.renewedTo = newBooking._id;
        activeBooking.renewal.renewedOn = new Date();
        activeBooking.renewal.method = req.payload.method || "user";

        await activeBooking.save({ session });

        // ✅ Commit transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Booking renewed successfully",
            status: "ok",
            booking: newBooking
        });

    } catch (error) {
        console.error(error);

        // ❌ Rollback everything if any error
        await session.abortTransaction();
        session.endSession();

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message,
            status: "failed"
        });
    }
};

module.exports = renewBooking;
