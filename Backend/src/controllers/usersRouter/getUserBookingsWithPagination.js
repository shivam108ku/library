const Booking = require("../../models/bookings");

const getUserBookingsWithPagination = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 5 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Count total bookings for this user
        const totalItems = await Booking.countDocuments({ user: userId });

        // Fetch bookings
        const bookings = await Booking.find({ user: userId })
            .populate("user", "username contactNo") // Populate basic user info
            .sort({ endDate: -1 }) // Sort by latest
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            status: "ok",
            bookings,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalItems / limitNum),
                totalItems
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = getUserBookingsWithPagination;