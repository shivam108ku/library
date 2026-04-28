const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    libId: {
        type: Number,
        min: 1,
        required: true,
        unique: true
    },
    username: {
        type: String,
        minLength: 3,
        maxLength: 40,
        required: true,
        trim: true
    },
    contactNo: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{10}$/,
        unique: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "third gender"],
        required: true,
        trim: true,
        lowercase: true
    },
    dateOfBirth: {
        type: Date
    },
    address: {
        type: String,
        minLength: 2,
        maxLength: 200,
        trim: true
    },
    profilePhotoUrl: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    isPasswordChanged: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create a compound unique index


// creating new collection "users"
const User = mongoose.model("users", userSchema);

module.exports = User;
