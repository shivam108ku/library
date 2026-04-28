const Enquiry = require("../../models/enquiries"); // Adjust path to your model

// 1. Get All Enquiries (With Search, Filter & Pagination)
const getAllEnquiries = async (req, res, next) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            type,   // Frontend sends 'type', maps to schema 'purpose'
            status 
        } = req.query;

        const query = {};

        // --- Search Logic (Name or Phone) ---
        if (search) {
            query.$or = [
                { enquirerName: { $regex: search, $options: "i" } },
                { contactNo: { $regex: search, $options: "i" } }
            ];
        }

        // --- Filters ---
        // Map 'type' from frontend to 'purpose' in DB
        if (type && type.toLowerCase() !== 'all') {
            query.purpose = type.toLowerCase();
        }

        if (status && status.toLowerCase() !== 'all') {
            query.status = status.toLowerCase();
        }

        // --- Pagination Calculation ---
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // --- Execute Query ---
        const totalItems = await Enquiry.countDocuments(query);
        
        const enquiries = await Enquiry.find(query)
            .sort({ createdAt: -1 }) // Newest first
            .skip(skip)
            .limit(limitNum);

        // --- Response ---
        res.status(200).json({
            status: "ok",
            enquiries,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalItems / limitNum),
                totalItems
            }
        });

    } catch (error) {
        next(error);
    }
}

module.exports = getAllEnquiries;