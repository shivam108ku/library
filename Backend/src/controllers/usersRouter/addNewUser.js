const User = require("../../models/users");
const validateFields = require("../../utils/validateFields");
const { generateSimplePassword } = require("../../utils/helperFunctions");

const addNewUser = async (req, res) => {
    try{
        // validate fields
        // this will first check if all the required fields are given or not
        // then, validate fields
        // if any ckeck fails, throw error
        validateFields.user(req.body);
        
        const {username, contactNo} = req.body;

        // adding libId in req.body
        const lastUser = await User.findOne().sort({ _id: -1 });
        req.body.libId = lastUser ? lastUser.libId + 1 : 1;

        req.body.password = generateSimplePassword(username, contactNo);
        
        // create new user
        let newUser;
        try {
             newUser = await User.create(req.body);
        } catch (error) {
            console.error(error);
            throw error;
        }

        res.status(201).json({
            status: "ok",
            user: newUser,
            message: "User added successfully"
        });

    } catch (error) {
        console.error(error);

        // Handle duplicate key error
        if (error.code === 11000) {
            // extract which field is duplicated
            // const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                status: "failed",
                message: `User already exists with the given username and contact number`
            });
        }

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            status: "failed",
            message: error.message || "Internal Server Error"
        });
    }

};

module.exports = addNewUser;

