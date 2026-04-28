const User = require("../../models/users");
const validateFields = require("../../utils/validateFields");
const generateOtp = require("../../utils/generateOtp");
const jwt = require("jsonwebtoken");


const sendOtpForLoginUser = async (req, res) => {
    try{
        //validate fields
        validateFields.loginUser(req.body);

        const { contactNumber } = req.body;

        const user = await User.findOne({ contactNo: contactNumber });

        if(!user){        
            return res.status(400).json({
                status: "failed",
                message: "User not found with the given contact number"
            });
        }

        const otp = generateOtp(4);

        // send otp to user's whatsapp number
        // await sendOtpWhatsapp(contactNumber, otp, "login", 5);  
        console.log(`OTP for login sent to ${contactNumber} is ${otp}`);

        // generating jwt token
        const token = jwt.sign({
                userId: user._id,  
                otp
            },
            process.env.JWT_KEY_FOR_OTP,
            { expiresIn: 60 * 5  } // 5 mins in seconds
        );

        // sending cookie
        res.cookie("loginToken", token, {
            httpOnly: true,          // prevents client-side JS access (recommended for security)
            secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
            maxAge: 1000 * 60 * 5, // 5 mins in milliseconds
            sameSite: "strict"       // helps protect against CSRF
        }); 

        res.status(201).json({
            status: "ok",
            message: "Otp Sent Successfully. Please verify otp to login."
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

module.exports = sendOtpForLoginUser;

