const CustomError = require("./CustomError");

const seatValidator = {
    available: (seat, shift) => {

        let shiftAvailable = [true, true];
        const currentDate = new Date(new Date().toISOString().slice(0, 10));

        if(seat.lastFullDayBooking && currentDate<=seat.lastFullDayBooking.expiryDate) {
            shiftAvailable[0] = false;
            shiftAvailable[1] = false;
        } else {
            if (seat.lastFirstShiftBooking && currentDate<=seat.lastFirstShiftBooking.expiryDate) {
                shiftAvailable[0] = false; 
            }
            if (seat.lastSecondShiftBooking && currentDate<=seat.lastSecondShiftBooking.expiryDate) {
                shiftAvailable[1] = false; 
            }
        }

        if(shift==="first") {
            if(!shiftAvailable[0]) {
                throw new CustomError("Seat is not available", 400);
            }
        } else if(shift==="second") {
            if(!shiftAvailable[1]) {
                throw new CustomError("Seat is not available", 400);
            }
        } else if(!shiftAvailable[0] || !shiftAvailable[1]) {
            throw new CustomError("Seat is not available", 400);
        }

        return true;
    }
}

module.exports = seatValidator;