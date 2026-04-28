const User = require("../../models/users");
const jwt = require("jsonwebtoken");

const verifyOtpAndRegisterUser = async (req, res) => {
    try{
        const { userId } = req.payload;

        const user = await User.findById(userId);  
        
        if(!user){
            return res.status(404).json({
                status: "failed",
                message: "User not found."
            });
        }

        // generating jwt token
        const token = jwt.sign({ 
                userId: user._id, 
                username: user.username, 
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
            user,
            message: "User logged in successfully."
        });

    } catch (error) {
        console.error(error);

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            status: "failed",
            message: error.message || "Internal Server Error"
        });
    }

};

module.exports = verifyOtpAndRegisterUser;

