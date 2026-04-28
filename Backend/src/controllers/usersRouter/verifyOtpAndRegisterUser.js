const User = require("../../models/users");
const jwt = require("jsonwebtoken");

const verifyOtpAndRegisterUser = async (req, res) => {
    try{
        // adding libId in req.body
        const totalUsers = await User.countDocuments();
        req.payload.libId = totalUsers + 1;

        // create new user
        const newUser = await User.create(req.payload);

        // generating jwt token
        const token = jwt.sign({ 
                userId: newUser._id, 
                username: newUser.username, 
                role: "user" 
            }, 
            process.env.JWT_KEY, 
            { expiresIn: 60 * 60 * 24 * 30 } // 7 days in seconds
        );

        // sending cookie
        res.cookie("token", token, {
            httpOnly: true,          // prevents client-side JS access (recommended for security)
            secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
            maxAge: 1000 * 60 * 60 * 24 * 30, // 7 days in milliseconds
            sameSite: "strict"       // helps protect against CSRF
        });

        res.status(201).json({
            status: "ok",
            newUser,
            message: "User registered successfully."
        });

    } catch (error) {
        console.error(error);

        // Handle duplicate key error
        if (error.code === 11000) {
            // extract which field is duplicated
            // const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                status: "failed",
                message: `User already exists with the given username and contact number`
            });
        }

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            status: "failed",
            message: error.message || "Internal Server Error"
        });
    }

};

module.exports = verifyOtpAndRegisterUser;

