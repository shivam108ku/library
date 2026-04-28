const Booking = require("../../models/bookings");
const User = require("../../models/users");
const Attendance = require("../../models/attendance");

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // --- Calculate Start of Current Month ---
        const startOfMonth = new Date(today);
        startOfMonth.setDate(1); // Set to the 1st day of the current month

        const fiveDaysFromNow = new Date(today);
        fiveDaysFromNow.setDate(today.getDate() + 5);

        const fourDaysAgo = new Date(today);
        fourDaysAgo.setDate(today.getDate() - 4);

        // --- 1. Aggregated Stats ---
        const statsPipeline = [
            {
                $facet: {
                    totalUsers: [{ $count: "count" }],
                    activeBookings: [
                        { $match: { endDate: { $gte: today } } },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                                occupiedSeats: { $addToSet: "$seatNo" },
                                totalRevenue: { 
                                    $sum: { $cond: [{ $eq: ["$payment.status", "paid"] }, "$payment.amount", 0] }
                                }
                            }
                        }
                    ],
                    pendingPayments: [
                        { $match: { "payment.status": "pending" } },
                        { $count: "count" }
                    ],
                    overduePayments: [
                        { 
                            $match: { 
                                "payment.status": "unpaid",
                                endDate: { $gte: today },
                                startDate: { $lte: fourDaysAgo }
                            } 
                        },
                        { $count: "count" }
                    ],
                    // --- CHANGED: Lifetime -> Current Month ---
                    currentMonthRevenue: [
                        { 
                            $match: { 
                                "payment.status": "paid",
                                startDate: { $gte: startOfMonth } // Filter by current month
                            } 
                        },
                        { $group: { _id: null, total: { $sum: "$payment.amount" } } }
                    ]
                }
            }
        ];

        const [statsResult] = await Booking.aggregate(statsPipeline);
        
        // Extract Stats
        const totalUsers = statsResult.totalUsers[0]?.count || 0;
        const activeMembersCount = statsResult.activeBookings[0]?.count || 0;
        const occupiedSeatsCount = statsResult.activeBookings[0]?.occupiedSeats.length || 0;
        const pendingCount = statsResult.pendingPayments[0]?.count || 0;
        const overdueCount = statsResult.overduePayments[0]?.count || 0;
        // --- CHANGED: Extraction ---
        const currentMonthRevenue = statsResult.currentMonthRevenue[0]?.total || 0;

        // --- 2. List Queries ---
        
        // Existing Lists
        const expiringSoon = await Booking.find({
            endDate: { $gte: today, $lte: fiveDaysFromNow }
        }).populate("user", "username contactNo").sort("endDate");
        // .limit(5);

        const verificationQueue = await Booking.find({
            "payment.status": "pending"
        }).populate("user", "username contactNo").sort("-updatedAt").limit(5);

        // --- Recent Activity ---
        const recentUsers = await User.find()
            .sort({ createdAt: -1 }) // Newest first
            .limit(5)
            .select("username contactNo createdAt profilePhotoUrl");

        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 }) // Newest first
            .limit(5)
            .populate("user", "username")
            .select("seatNo shift createdAt user payment isTrial");

        // --- 3. Map & Attendance ---
        const activeSeats = await Booking.find({ endDate: { $gte: today } })
            .select("seatNo shift user").populate("user", "username");

        const activeAttendance = await Attendance.countDocuments({
            date: { $gte: today }, timeOut: { $exists: false } 
        });

        const checkedOutToday = await Attendance.countDocuments({
            date: { $gte: today }, timeOut: { $exists: true } 
        });

        return res.status(200).json({
            status: "ok",
            data: {
                stats: {
                    totalUsers,
                    activeMembers: activeMembersCount,
                    occupancyPercentage: Math.round((occupiedSeatsCount / 100) * 100),
                    revenue: currentMonthRevenue, // --- CHANGED: Variable mapped here ---
                    pendingVerifications: pendingCount,
                    overduePayments: overdueCount,
                    activeAttendance,
                    checkedOutToday
                },
                lists: {
                    expiringSoon,
                    verificationQueue,
                    recentUsers,
                    recentBookings
                },
                seatMap: activeSeats
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            status: "failed",
            error: error.message || "Internal Server Error"
        });
    }
};

module.exports = getDashboardStats;