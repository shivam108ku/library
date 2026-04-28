const User = require("../../models/users");

const getAllUsers = async (req, res) => {
    try {

        // fetch all users
        const users = await User.find().select("_id contactNo username");

        return res.status(200).json({
            users,
            status: "ok",
            message: "Users fetched successfully"
        });

    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: "failed",
            error: error.message || "Internal server error"
        });
    }
};

module.exports = getAllUsers;
