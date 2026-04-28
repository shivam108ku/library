const User = require("../../models/users");

const authenticateUserOnMount = async (req, res) => {
    try{
        const { userId } = req.payload;

        const user = await User.findById(userId);  
        
        if(!user){
            return res.status(404).json({
                status: "failed",
                message: "User not found."
            });
        }

        res.status(201).json({
            status: "ok",
            user,
            message: "User authenticated in successfully."
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

module.exports = authenticateUserOnMount;

