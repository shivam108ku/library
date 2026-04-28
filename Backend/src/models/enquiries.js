const mongoose = require("mongoose");
const { Schema } = mongoose;

// enquirySchema
const enquirySchema = new Schema({
    contactNo: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{10}$/
    },
    enquirerName: {
        type: String,
        minLength: 3,
        maxLength: 40,
        required: true,
        trim: true
    },
    trialDate: {
        type: Date,
        required: true
    },
}, {
    timestamps: true
});


// creating new collection "enquiries"
const Enquiry = mongoose.model("enquiries", enquirySchema);

module.exports = Enquiry;