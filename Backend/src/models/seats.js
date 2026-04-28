const mongoose = require("mongoose");
const { Schema } = mongoose;

// seatSchema
const seatSchema = new Schema({
    seatNo: {
        type: Number,
        min: 1,
        max: 100,
        required: true
    }
});


// creating new collection "seats"
const Seat = mongoose.model("seats", seatSchema);

module.exports = Seat;