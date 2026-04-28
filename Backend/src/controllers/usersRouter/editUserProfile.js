const User = require("../../models/users");
const validateFields = require("../../utils/validateFields");   
const editUserProfile = async (req, res) => {
    try {
        // validate fields
        validateFields.editUserProfile(req.body);

        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: "failed", message: "User does not exist" });
        }   

        // update user profile
        user.contactNo = req.body.contactNo || user.contactNo;
        user.username = req.body.username || user.username;
        user.address = req.body.address || user.address;
        user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
        user.gender = req.body.gender || user.gender;       

        await user.save();

        res.status(200).json({
            status: "ok",
            user,
            message: "User profile updated successfully"
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

module.exports = editUserProfile;   