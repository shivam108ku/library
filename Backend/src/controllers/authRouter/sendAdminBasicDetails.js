const Admin = require("../../models/admins")
const User = require("../../models/users");
const Booking = require("../../models/bookings");

const sendAdminBasicDetails = async (req, res) => {
    try {
        const { _id } = req.payload;

        const admin = await Admin.findById(_id);

        if(!admin)
            return res.status(404).json({
                status: "failed", 
                message:"Admin doesn't exist"
            });

        // fetch all users
        const users = await User.find()

        // get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // fetch all seats whose booking end date is today or in future
        const seats = await Booking.find({
            endDate: { $gte: today }
        }).populate("user");

        // creating reply
        const reply = {
            admin: {
                adminName: admin.adminName,
                _id: admin._id,
                phoneNo: admin.phoneNo,
                profileImageUrl: admin.profileImageUrl,
                role: admin.role,
            },
            users,
            seats,
            message: "Admin authenticated successfully",
            status: "ok"
        } 

        // sending response with status code
        res.status(200).json(reply);

    } catch(error) {
        console.log(error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message,
            status: "failed"
        });
    }
}

module.exports = sendAdminBasicDetails;