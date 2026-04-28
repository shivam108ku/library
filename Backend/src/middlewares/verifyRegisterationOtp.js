const jwt = require("jsonwebtoken");

const verifyRegisterationOtp = async (req, res, next) => {
    try {
        // Extract token from cookie
        const { registerationToken } = req.cookies;
        const { userOtp }  = req.body;

        if(!userOtp){
            return res.status(400).json({
                status: "failed",
                message: "OTP is required."
            });
        }
        if (!registerationToken) {
            return res.status(401).json({
                status: "failed",
                message: "Authentication required. Please register."
            });
        }
        
        // Verify token validity
        let payload;
        try {
            payload = jwt.verify(registerationToken, process.env.JWT_KEY_FOR_OTP);
        } catch (err) {
            // jwt.verify can throw different errors
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    status: "failed",
                    message: "Session expired. Please register again."
                });
            }
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid token. Please register again."
                });
            }
            throw err;
        }

        if(payload.otp !== userOtp){
            return res.status(400).json({
                status: "failed",
                message: "Invalid OTP. Please try again."
            });
        }

        // Attach payload to request object
        req.payload = payload;

        // Pass control to the next middleware
        next();

    } catch (error) {
        console.error("Token verification failed:", error.message);
        res.status(500).json({
            status: "failed",
            message: "Authentication failed. Please try again later."
        });
    }
};

module.exports = verifyRegisterationOtp;
