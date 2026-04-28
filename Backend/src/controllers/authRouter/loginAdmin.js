const Admin = require("../../models/admins")
const User = require("../../models/users");
const Booking = require("../../models/bookings");
const validateFields = require("../../utils/validateFields");
const password = require("../../utils/password");
const jwt = require("jsonwebtoken");
const CustomError = require("../../utils/CustomError");

const loginAdmin = async (req, res) => {
    try {
        // this validator fnctions ensures that req.body will always have mandatory fields, and phoneNo is valid
        validateFields.loginAdmin(req.body);

        // this function first checks whether the admin with the given phoneNo exists
        // If yes, then checks whether the given password is right or wrong
        // if password is true, then returns admin details else throw error "Invalid Credentials"
        const admin = await getAdmin(req.body)

        // fetch all users
        const users = await User.find()

        // get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // fetch all seats whose booking end date is today or in future
        const seats = await Booking.find({
            endDate: { $gte: today }
        }).populate("user");
        
        // generating jwt token
        const token = jwt.sign({ 
                _id: admin._id, 
                adminName: admin.adminName, 
                role: admin.role 
            }, 
            process.env.JWT_KEY, 
            { expiresIn: 60 * 60 * 24 * 7 } // 7 days in seconds
        );

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
            message: "Logged in successfully",
            status: "ok"
        } 

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true for HTTPS
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

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


// this function takes the admin details then, 
// first checks whether the admin with the given phoneNo exists
// If yes, then checks whether the given password is right or wrong
// if password is true, then returns admin details else throw error "Invalid Credentials"
async function getAdmin ({phoneNo, password: givenPassword}) {
        // extracting admin details with the given phoneNo
        const admin = await Admin.findOne({phoneNo});
        if(!admin || !admin.password)
            throw new CustomError("Invalid Credentials", 400);

        // comparing given password with the admin real password
        const isRightPassword = await password.compare(givenPassword, admin.password);
        if(!isRightPassword)
            throw new CustomError("Invalid Credentials", 400);
        
        // if all credentials are right
        return admin;
}

module.exports = loginAdmin;