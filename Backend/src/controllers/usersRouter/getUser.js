const User = require("../../models/users");
const mongoose = require("mongoose");
const CustomError = require("../../utils/CustomError");

const getUser = async (req, res) => {
    try {

        const { userId } = req.params;

        if (!userId)
            throw new CustomError("userId is not given", 400);

        // check if userId is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId))
            throw new CustomError("Invalid userId given", 400);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ 
                status: "failed", 
                message: "User does not exist"
            });
        }

        return res.status(200).json({
            status: "ok",
            user
        });

    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: "failed",
            error: error.message || "Internal server error"
        });
    }
};

module.exports = getUser;
