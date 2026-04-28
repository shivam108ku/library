const authRouter = require("./authRouter");
const bookingRouter = require("./bookingRouter");
const seatsRouter = require("./seatsRouter");
const userRouter = require('./userRouter');

module.exports = { 
    authRouter,
    userRouter,
    bookingRouter,
    seatsRouter
}