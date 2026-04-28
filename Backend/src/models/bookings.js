const mongoose = require("mongoose");
const { Schema } = mongoose;

// bookingSchema
const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    seatNo: {
        type: Number,
        min: 1,
        max: 109,
        required: true
    },
    shift: {
        type: String,
        enum: ["first", "second", "fullday"],
        lowercase: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
    },
    payment: {
        status: {
            type: String,
            enum: ["unpaid", "paid", "pending", "failed"], //pending means payment is in process - screenshot taken but not confirmed by admin
        },
        lastUpdated: {
            type: Date,
        },
        screenshotUrl: {    
            type: String,
            trim: true
        },
        method: {
            type: String,
            enum: ["upi", "netbanking", "card", "wallet", "cash", null]
        },
        amount: {
            type: Number,
            min: 0
        }
    },
    isTrial: {
       type: Boolean 
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 100
    },
    renewal: { 
        isRewewed: { type: Boolean, }, 
        renewedFrom: {
            type: Schema.Types.ObjectId, 
            ref: "bookings", 
        },
        renewedTo: { 
            type: Schema.Types.ObjectId, 
            ref: "bookings", 
        }, 
        renewedOn: { type: Date, }, 
        method: { 
            type: String, 
            enum: ["admin", "user"] 
        } 
    }
}, {
    timestamps: true
});


// creating new collection "bookings"
const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;