const Admin = require("../../models/admins");
const validateFields = require("../../utils/validateFields");
const password = require("../../utils/password");

const createNewAdmin = async (req, res) => {
    try{

        // validate fields
        // this will first check if all the required fields are given or not
        // then, validate fields
        // if any ckeck fails, throw error
        validateFields.admin(req.body);

        // hashing password
        req.body.password = await password.hash(req.body.password);

        // create new user
        const newAdmin = await Admin.create(req.body);

        res.status(201).json({status: "ok", message: "Admin created successfully"});

    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message,
            status: "failed"
        });
    }

};

module.exports = createNewAdmin;

