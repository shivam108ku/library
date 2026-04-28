const CustomError = require("./CustomError");
const validator = require("validator");
const mongoose = require("mongoose");

const validateFields = {
    user: function(userData) {

        const { username, contactNo, gender } = userData;

        // checking if required fields are given or not
        if(!(username && contactNo && gender))
            throw new CustomError("Missing required fields", 400);

    },

    admin: function(adminData) {

        const { adminName, phoneNo, password } = adminData;

        // checking if required fields are given or not
        if(!(adminName && phoneNo && password))
            throw new CustomError("Missing required fields", 400);

    },

    //  to validate login details
    loginAdmin: (loginDetails) => {
        const {phoneNo, password} = loginDetails;
        if(!(phoneNo && password))
            throw new CustomError("Missing required fields", 400);
        
        // Regex for a valid Indian phone number (10 digits, starts with 6–9)
        let phoneRegex = /^[6-9]\d{9}$/;
    
        if (!phoneRegex.test(phoneNo)) 
            throw new CustomError("Invalid Credentials", 400);
    },

    booking: function(bookingData) {

        const { userId, seatNo, shift, startDate, endDate } = bookingData;

        // checking if required fields are given or not
        if(!(userId && seatNo && shift && startDate && endDate))
            throw new CustomError("Missing required fields", 400);

        // checking if user is of valid mongodb object type
        if (!mongoose.Types.ObjectId.isValid(userId)) 
            throw new CustomError("Invalid userId given", 400);

        // checking if seatNo is a valid Number and more than 0
        if (isNaN(seatNo))
            throw new CustomError("Invalid Seat number given", 400);
        const sNo = Number(seatNo);
        if(sNo<=0 || sNo>process.env.TOTAL_SEATS)
            throw new CustomError("Invalid Seat number given", 400);

        // validating shift
        const validShifts = ["first", "second", "fullday"];
        if (!validShifts.includes(shift.toLowerCase().trim())) 
            throw new CustomError("Invalid shift value. Allowed: first, second, fullday", 400);

        // checking if the given start date is of valid YYYY-MM-DD format
        if (!validator.isDate(startDate, { format: 'YYYY-MM-DD', strictMode: true })) {
            throw new CustomError("Date must be in YYYY-MM-DD format.", 400);
        }

        // checking if the given end date is of valid YYYY-MM-DD format
        if (!validator.isDate(endDate, { format: 'YYYY-MM-DD', strictMode: true })) {
            throw new CustomError("Date must be in YYYY-MM-DD format.", 400);
        }

        // creating the date objects from the given start and end date in string format
        bookingData.startDate = new Date(startDate);
        bookingData.endDate = new Date(endDate);
    },

    bookingAuto: function(bookingData) {

        const { userId, shift, startDate, endDate } = bookingData;

        // checking if required fields are given or not
        if(!(userId && shift && startDate && endDate))
            throw new CustomError("Missing required fields", 400);

        // checking if user is of valid mongodb object type
        if (!mongoose.Types.ObjectId.isValid(userId)) 
            throw new CustomError("Invalid userId given", 400);

        // validating shift
        const validShifts = ["first", "second", "fullday"];
        if (!validShifts.includes(shift.toLowerCase().trim())) 
            throw new CustomError("Invalid shift value. Allowed: first, second, fullday", 400);

        // checking if the given start date is of valid YYYY-MM-DD format
        if (!validator.isDate(startDate, { format: 'YYYY-MM-DD', strictMode: true })) {
            throw new CustomError("Date must be in YYYY-MM-DD format.", 400);
        }

        // checking if the given end date is of valid YYYY-MM-DD format
        if (!validator.isDate(endDate, { format: 'YYYY-MM-DD', strictMode: true })) {
            throw new CustomError("Date must be in YYYY-MM-DD format.", 400);
        }

        // creating the date objects from the given start and end date in string format
        bookingData.startDate = new Date(startDate);
        bookingData.endDate = new Date(endDate);
    },

    payment: function(paymentData) {
        const { amount, bookingId } = paymentData;

        if(!bookingId)
            throw new CustomError("bookingId is not given", 400);

        // checking if bookingId is of valid mongodb object type
        if (!mongoose.Types.ObjectId.isValid(bookingId)) 
            throw new CustomError("Invalid bookingId given", 400);

        if(!amount)
            throw new CustomError("Amount is not given", 400);

        // checking if amount is a valid Number and more than 0
        if (isNaN(amount) || Number(amount)<0)
            throw new CustomError("Invalid amount given", 400);
    },

    loginUser: function(loginData) {
        const { contactNumber, password } = loginData;        
        
        if(!(contactNumber && password))
            throw new CustomError("Required fields are not given", 400);

        // Regex for a valid Indian phone number (10 digits, starts with 6–9)
        let phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(contactNumber))
            throw new CustomError("Invalid contact number", 400);
    },

    editUserProfile: function(profileData) {
        const { username, dateOfBirth, address, gender, contactNo } = profileData;

        if(username) {
            if(typeof username !== "string" || username.trim().length < 3 || username.trim().length > 40) {
                throw new CustomError("Invalid username. It should be a string between 3 and 40 characters.", 400);
            }
        }   
        if(dateOfBirth) {
            if (!validator.isDate(dateOfBirth, { format: 'YYYY-MM-DD', strictMode: true })) {
                throw new CustomError("Date of Birth must be in YYYY-MM-DD format.", 400);
            }       
            const dob = new Date(dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            if(age < 5 || age > 90) {
                throw new CustomError("Invalid age. Age must be between 5 and 90 years.", 400);
            }

            profileData.dateOfBirth = dob;
        }           
        if(address) {
            if(typeof address !== "string" || address.trim().length < 2 || address.trim().length > 200) {
                throw new CustomError("Invalid address. It should be a string between 2 and 200 characters.", 400);
            }
        } 
        if(gender) {
            const validGenders = ["male", "female", "third gender"];
            if (!validGenders.includes(gender.toLowerCase().trim())) {                      
                throw new CustomError("Invalid gender value. Allowed: male, female, third gender", 400);
            }   
        }
        if(contactNo) {
            // Regex for a valid Indian phone number (10 digits, starts with 6–9)
            let phoneRegex = /^[6-9]\d{9}$/;        
            if (!phoneRegex.test(contactNo))
                throw new CustomError("Invalid contact number", 400);
        }   
    },
    enquiry: function(enquiryData) {
        const { enquirerName, trialDate, contactNo } = enquiryData;

        // checking if required fields are given or not
        if(!(enquirerName && contactNo && trialDate))
            throw new CustomError("Missing required fields", 400);

        // checking if the given trial date is of valid YYYY-MM-DD format
        if (!validator.isDate(trialDate, { format: 'YYYY-MM-DD', strictMode: true })) {
            throw new CustomError("Date must be in YYYY-MM-DD format.", 400);
        }

        // creating the date objects from the given trial date in string format
        enquiryData.trialDate = new Date(trialDate);
    },
     
    editBooking: function(bookingData) {

        const { userId, seatNo, shift, startDate, endDate, payment } = bookingData;

        // checking if required fields are given or not
        if(!(userId && seatNo && shift && startDate && endDate && payment))
            throw new CustomError("Missing required fields", 400);

        // checking if user is of valid mongodb object type
        if (!mongoose.Types.ObjectId.isValid(userId)) 
            throw new CustomError("Invalid userId given", 400);

        // checking if seatNo is a valid Number and more than 0
        if (isNaN(seatNo))
            throw new CustomError("Invalid Seat number given", 400);
        const sNo = Number(seatNo);
        if(sNo<=0 || sNo>process.env.TOTAL_SEATS)
            throw new CustomError("Invalid Seat number given", 400);

        // validating shift
        const validShifts = ["first", "second", "fullday"];
        if (!validShifts.includes(shift.toLowerCase().trim())) 
            throw new CustomError("Invalid shift value. Allowed: first, second, fullday", 400);

        // checking if the given start date is of valid YYYY-MM-DD format
        if (!validator.isDate(startDate, { format: 'YYYY-MM-DD', strictMode: true })) {
            throw new CustomError("Date must be in YYYY-MM-DD format.", 400);
        }

        // checking if the given end date is of valid YYYY-MM-DD format
        if (!validator.isDate(endDate, { format: 'YYYY-MM-DD', strictMode: true })) {
            throw new CustomError("Date must be in YYYY-MM-DD format.", 400);
        }

        // creating the date objects from the given start and end date in string format
        bookingData.startDate = new Date(startDate);
        bookingData.endDate = new Date(endDate);

        const { status, amount } = payment 
        if(!status) {
            throw new CustomError("Payment status is required", 400);
        }
        if(status !== "unpaid" && status !== "pending" && status !== "paid" && status !== "failed") {
            throw new CustomError("Invalid payment status value. Allowed: unpaid, pending, paid, failed", 400);
        }
        if(isNaN(amount)) {
            throw new CustomError("Payment amount is required", 400);
        }
        if (amount<0 || amount>10000) {
            throw new CustomError("Invalid payment amount", 400);
        }
    },
};

module.exports = validateFields;