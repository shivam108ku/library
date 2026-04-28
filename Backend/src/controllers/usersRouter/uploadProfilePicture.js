const User = require("../../models/users");
const { uploadToGoogleDrive } = require("../../services/googleDriveService");

const uploadProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Check if file exists
        if (!req.file) {
            return res.status(400).json({ status: "failed", message: "No file uploaded" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        // 2. Upload to Google Drive
        const publicUrl = await uploadToGoogleDrive(req.file);

        // 3. Update User in DB
        user.profilePhotoUrl = publicUrl;
        await user.save();

        res.status(200).json({
            status: "ok",
            user,
            message: "Profile picture updated successfully"
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({
            status: "failed",
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports = uploadProfilePicture;