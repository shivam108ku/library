const redisClient = require("../../config/redis");

const logoutAdmin = async (req, res) => {
    try {
        const {token} = req.cookies;

        // adding token in blocked list
        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, req.payload.exp);

        // Clear cookie securely
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        
        res.status(200).json({
            status: "ok",
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(503).json({
            status: "failed",
            message: error.message
        });
    }

}

module.exports = logoutAdmin;