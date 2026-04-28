const Enquiry = require("../models/enquiries"); // Adjust path if needed
const CustomError = require("../utils/CustomError"); 

const enquiryController = {
    // 1. Get All Enquiries (Date-wise)
    getAllEnquiries: async (req, res, next) => {
        try {
            const { 
                page = 1, 
                limit = 10, 
                search, 
                date // YYYY-MM-DD string from frontend
            } = req.query;

            const query = {};

            // --- Search Logic (Name or Phone) ---
            if (search) {
                query.$or = [
                    { enquirerName: { $regex: search, $options: "i" } },
                    { contactNo: { $regex: search, $options: "i" } }
                ];
            }

            // --- Date Filter Logic ---
            if (date) {
                // Create start and end of the selected day
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);

                query.trialDate = {
                    $gte: startOfDay,
                    $lte: endOfDay
                };
            }

            // --- Pagination ---
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;

            // --- Execute Query ---
            const totalItems = await Enquiry.countDocuments(query);
            
            const enquiries = await Enquiry.find(query)
                .sort({ trialDate: 1 }) // Sort by Trial Date (Earliest first)
                .skip(skip)
                .limit(limitNum);

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
    },

    // 2. Delete Enquiry
    deleteEnquiry: async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

            if (!deletedEnquiry) {
                throw new CustomError("Enquiry not found", 404);
            }

            res.status(200).json({
                status: "ok",
                message: "Enquiry deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Note: Removed updateEnquiryStatus as 'status' field no longer exists in your schema
};

module.exports = enquiryController;