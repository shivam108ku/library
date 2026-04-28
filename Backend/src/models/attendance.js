const mongoose = require("mongoose");
const { Schema } = mongoose;

// attendanceSchema
const attendanceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,       // reference to user
        ref: "users",   
        required: true
    },
    booking: {
        type: Schema.Types.ObjectId,       // reference to booking
        ref: "bookings",   
        required: true
    },
    date: {                // date of attendance without time
        type: Date,
        required: true
    },
    timeIn: {             // time of attendance with date
        type: Date,
        required: true  
    },
    timeOut: {            // time of leaving with date
        type: Date, 
        required: false
    },
});


// creating new collection "attendance"
const Attendance = mongoose.model("attendance", attendanceSchema);

module.exports = Attendance;