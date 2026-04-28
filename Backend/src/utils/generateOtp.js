const generateOtp = (length) => {
    let otp = '';
    const characters = '0123456789';  // OTP will contain only digits
    for (let i = 0; i < length; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
};

module.exports = generateOtp;