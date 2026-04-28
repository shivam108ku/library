const { mongo } = require("mongoose");
const Booking = require("../../models/bookings");
const validateFields = require("../../utils/validateFields");

const editBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // validate fields
        validateFields.editBooking(req.body);

        const { userId, seatNo, shift, startDate, endDate, payment, notes, isTrial } = req.body;

        if(mongo.ObjectId.isValid(bookingId) === false) {
            return res.status(400).json({ status: "failed", message: "Invalid booking ID"});
        }

        const booking = await Booking.findById(bookingId);

        if(!booking) {
            return res.status(404).json({ status: "failed", message: "Booking does not exist"});
        }

        if(booking.user.toString() !== userId) {
            return res.status(400).json({ status: "failed", message: "Booking does not belong to the specified user"});
        }
        
        // check if there is any change in any field
        const isUpdateNeeded =
            Number(seatNo) !== Number(booking.seatNo) ||
            shift !== booking.shift ||
            new Date(startDate).getTime() !== booking.startDate.getTime() ||
            new Date(endDate).getTime() !== booking.endDate.getTime();

        if(isUpdateNeeded) {
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
                seatNo: seatNo,
                _id: { $ne: bookingId }
            });

            if(exists)
                return res.status(400).json({ status: "failed", message: "Seat is already booked"});

            booking.seatNo = seatNo;
            booking.shift = shift;
            booking.startDate = startDate;
            booking.endDate = endDate;
        }
        
        if(payment.status !== booking.payment.status)  {
            booking.payment.status = payment.status;
            booking.payment.lastUpdated = new Date();
            if(payment.status === "unpaid") {
                booking.payment.method = null;
            }
        }
        booking.payment.amount = payment.amount;
        if(payment.method)
            booking.payment.method = payment.method;
        
        if(notes)
            booking.notes = notes;

        if (
            isTrial === true ||
            (booking.isTrial != null && booking.isTrial !== isTrial)
        ) {
            booking.isTrial = isTrial;
        }



        await booking.save();

        res.status(200).json({
            status: "ok",
            message: "Booking updated successfully"
        });
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ 
            status: "failed",
            error: error.message || "Internal server error"
        });

    }

};

module.exports = editBooking;