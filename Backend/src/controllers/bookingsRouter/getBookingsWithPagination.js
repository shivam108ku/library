const Booking = require("../../models/bookings");
const User = require("../../models/users");

const getBookingsWithPagination = async (req, res) => {
    try {
        const isDownload = req.query.download === 'true';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, shift, paymentStatus, status, month, sort, sortBy } = req.query;

        // --- 1. BUILD QUERY ---
        let query = {};

        if (shift && shift !== 'All') query.shift = shift;
        if (paymentStatus && paymentStatus !== 'All') query['payment.status'] = paymentStatus;
        if (month && month !== 'All') {
            query.$expr = { $eq: [{ $month: "$startDate" }, parseInt(month)] };
        }
        if (status && status !== 'All') {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            if (status === 'active') query.endDate = { $gte: today };
            else if (status === 'completed') query.endDate = { $lt: today };
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            const matchingUsers = await User.find({
                $or: [{ username: searchRegex }, { contactNo: searchRegex }]
            }).select('_id');

            const matchingUserIds = matchingUsers.map(u => u._id);
            const isNumber = !isNaN(search);
            
            const searchQuery = isNumber 
                ? { $or: [{ seatNo: parseInt(search) }, { user: { $in: matchingUserIds } }] }
                : { user: { $in: matchingUserIds } };

            query = { ...query, ...searchQuery };
        }

        // --- 2. DETERMINE SORT LOGIC ---
        const sortDirection = sort === 'asc' ? 1 : -1;
        let sortOptions = {};

        if (sortBy === 'seatNo') {
            // Primary Sort: Seat Number (Ascending or Descending based on user input)
            // Secondary Sort: Shift (Always Ascending: first -> fullday -> second)
            sortOptions = { 
                seatNo: sortDirection, 
                shift: 1 
            };
        } else {
            // Default: Sort by Start Date
            sortOptions = { startDate: sortDirection };
        }

        // --- 3. EXECUTE QUERY ---
        let bookingsQuery = Booking.find(query)
            .populate('user', 'username contactNo profilePhotoUrl')
            .sort(sortOptions);

        if (!isDownload) {
            bookingsQuery = bookingsQuery.skip(skip).limit(limit);
        }

        const bookings = await bookingsQuery;
        
        let totalBookings = 0;
        if (!isDownload) {
            totalBookings = await Booking.countDocuments(query);
        } else {
            totalBookings = bookings.length;
        }

        return res.status(200).json({
            status: "ok",
            bookings,
            pagination: {
                totalItems: totalBookings,
                currentPage: page,
                totalPages: isDownload ? 1 : Math.ceil(totalBookings / limit),
                itemsPerPage: isDownload ? totalBookings : limit
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

module.exports = getBookingsWithPagination;