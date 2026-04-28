const Enquiry = require("../../models/enquiries");
const validateFields = require("../../utils/validateFields");

const createNewEnquiry = async (req, res) => {
    try {
        
        // validate fields
        validateFields.enquiry(req.body);

        // creating new Enquiry
        const newEnquiry = await Enquiry.create(req.body);

        res.status(201).json({
            booking: newEnquiry,
            status: "ok",
            message: "New Enquiry created successfully"
        });
    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ 
            status: "failed",
            error: error.message || "Internal server error"
        });

    }

};

module.exports = createNewEnquiry;