const Booking = require("../../models/bookings");
const User = require("../../models/users");

const getAllBookingsBySeatNo = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, shift, paymentStatus, status } = req.query;
        const { seatNo } = req.params;

        // Base Query
        let query = {};
        query.seatNo = seatNo;

        // 1. Shift Filter
        if (shift && shift !== 'All') {
            query.shift = shift;
        }

        // 2. Payment Status Filter
        if (paymentStatus && paymentStatus !== 'All') {
            query['payment.status'] = paymentStatus;
        }

        // 3. Booking Status Filter (Active/Completed)
        if (status && status !== 'All') {
            const today = new Date();
            // Assuming we check end of day for today
            today.setUTCHours(0, 0, 0, 0);
            
            if (status === 'active') {
                query.endDate = { $gte: today };
            } else if (status === 'completed') {
                query.endDate = { $lt: today };
            }
        }

        // 4. Search Logic (Complex due to populated fields)
        // If search term exists, we first find matching users, then filter bookings
        if (search) {
            const searchRegex = new RegExp(search, 'i');

            // Find users matching name or phone
            const matchingUsers = await User.find({
                $or: [
                    { username: searchRegex },
                    { contactNo: searchRegex }
                ]
            }).select('_id');

            const matchingUserIds = matchingUsers.map(u => u._id);

            query.user = { $in: matchingUserIds };
            
        }

        // Execute Query with Pagination
        const totalBookings = await Booking.countDocuments(query);
        
        const bookings = await Booking.find(query)
            .populate('user', 'username contactNo profilePhotoUrl') // Populate necessary user fields
            .sort({ createdAt: -1 }) // Sort by newest
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            status: "ok",
            bookings,
            pagination: {
                totalItems: totalBookings,
                currentPage: page,
                totalPages: Math.ceil(totalBookings / limit),
                itemsPerPage: limit
            }
        });

    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({
            status: "failed",
            error: error.message || "Internal server error"
        });
    }
};

module.exports = getAllBookingsBySeatNo;