const validateFields = require("../../utils/validateFields");
const generateOtp = require("../../utils/generateOtp");
const jwt = require("jsonwebtoken");
const { sendGreetingMessage } = require("../../services/whatsappService")

const sendOtpForRegisteration = async (req, res) => {
    try{

        // validate fields
        // this will first check if all the required fields are given or not
        // then, validate fields
        // if any ckeck fails, throw error
        validateFields.user(req.body);
        const { username, contactNo, gender } = req.body;

        const otp = generateOtp(4);

        // send otp to user's whatsapp number
        // await sendOtpWhatsapp(contactNo, otp);
        console.log(`OTP for registeration sent to ${contactNo} is ${otp}`);

        // generating jwt token
        const token = jwt.sign({
                username,
                contactNo,  
                gender,
                otp
            }, 
            process.env.JWT_KEY_FOR_OTP, 
            { expiresIn: 60 * 10  } // 10 mins in seconds
        );

        // sending cookie
        res.cookie("registerationToken", token, {
            httpOnly: true,          // prevents client-side JS access (recommended for security)
            secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
            maxAge: 1000 * 60 * 10, // 10 mins in milliseconds
            sameSite: "strict"       // helps protect against CSRF
        });

        // await sendGreetingMessage(contactNo, otp);

        res.status(201).json({
            status: "ok",
            message: "Otp Sent Successfully. Please verify otp to complete registration."
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

module.exports = sendOtpForRegisteration;

