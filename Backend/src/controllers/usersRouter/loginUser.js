const User = require("../../models/users");
const validateFields = require("../../utils/validateFields");
const jwt = require("jsonwebtoken");


const loginUser = async (req, res) => {
    try{
        //validate fields
        validateFields.loginUser(req.body);

        const { contactNumber, password } = req.body;

        const user = await User.findOne({ contactNo: contactNumber });

        if(!user){        
            return res.status(400).json({
                status: "failed",
                message: "User not found with the given contact number"
            });
        }

        if(user.password !== password) {        
            return res.status(400).json({
                status: "failed",
                message: "Invalid Credentials"
            });
        }

        // generating jwt token
        const token = jwt.sign({ 
                userId: user._id, 
                username: user.username, 
                role: "user" 
            }, 
            process.env.JWT_KEY, 
            { expiresIn: 60 * 60 * 24 * 30 } // 30 days in seconds
        );

        // sending cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true for HTTPS
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30,   // 30 days
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

module.exports = loginUser;

