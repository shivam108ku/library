const logoutUser = async (req, res) => {
    try {
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

module.exports = logoutUser;