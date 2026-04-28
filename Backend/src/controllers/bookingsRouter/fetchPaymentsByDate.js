const Booking = require("../../models/bookings");

const fetchPaymentsByDate = async (req, res) => {
    try {
        const { date } = req.query; // Expects format: "YYYY-MM-DD" (e.g., "2024-02-28")

        if (!date) {
            return res.status(400).json({
                message: "Date query parameter is required",
                status: "failed"
            });
        }

        // 1. Manually parse the date string parts to avoid timezone shifting
        const [year, month, day] = date.split('-').map(Number);

        // 2. Create the start of the requested day (00:00:00.000)
        const startDate = new Date(year, month - 1, day);
        startDate.setHours(0, 0, 0, 0);

        // 3. Create the start of the next day (to define the upper bound)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        // 4. Query Bookings
        const payments = await Booking.find({
            "payment.status": "paid",
            "payment.lastUpdated": {
                $gte: startDate,
                $lt: endDate
            },
            "isTrial": { $ne: true } // Exclude trial bookings
        })
        .populate({
            path: "user",
            select: "username contactNo libId gender", // Fetching relevant user details
        })
        .sort({ "payment.lastUpdated": -1 }); // Newest payments first

        // 5. Calculate total amount collected for that day (optional but helpful)
        const totalAmount = payments.reduce((sum, booking) => sum + (booking.payment.amount || 0), 0);

        return res.status(200).json({
            count: payments.length,
            totalAmount,
            payments,
            message: "Payment records fetched successfully",
            status: "ok"
        });

    } catch (error) {
        console.error("Error fetching payments:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || "Internal Server Error",
            status: "failed"
        });
    }
};

module.exports = fetchPaymentsByDate;