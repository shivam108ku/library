const mongoose = require("mongoose");
const { Schema } = mongoose;

// adminSchema
const adminSchema = new Schema({
    adminName: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        minLength: 3,
        maxLength: 40,
        trim: true,
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[0-9]{10}$/
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["owner", "manager"],
        trim: true,
        lowercase: true,
        default: "manager" 
    },
    profilePhotoUrl: {
        type: String,
        trim: true
    },
}, {
    timestamps: true
});

// creating new collection "admins"
const Admin = mongoose.model("admins", adminSchema);

module.exports = Admin;