const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const verifyToken = async (req, res, next) => {
    try {
        // Extract token from cookie
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                status: "failed",
                message: "Authentication required. Please log in."
            });
        }

        // Verify token validity
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            // jwt.verify can throw different errors
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    status: "failed",
                    message: "Session expired. Please log in again."
                });
            }
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid token. Please log in again."
                });
            }
            throw err;
        }

        // Check if token is blocked
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({
                status: "failed",
                message: "This session has been logged out. Please log in again."
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

module.exports = verifyToken;
