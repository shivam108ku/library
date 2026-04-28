require("dotenv").config();
const express = require("express");
const app = express();
const redisClient = require("./src/config/redis");
const main = require("./src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { authRouter, userRouter, bookingRouter, seatsRouter } = require("./src/routes");
const attendanceRouter = require("./src/routes/attendanceRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");
const enquiryRouter = require("./src/routes/enquiryRouter");

// resolving cors issues for frontend origin
app.use(cors({
    origin: [process.env.FRONTEND_ORIGIN, "https://parikshalibrary.in", "https://www.parikshalibrary.in", "http://localhost:5174", process.env.WAKE_UP_ORIGIN],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

// Routes
// for auth related routes - login, logout, check authentication
app.use("/auth", authRouter);

// to add new user
app.use("/users", userRouter)

// for seats related routes
app.use("/seats", seatsRouter);

// // for users related routes
// app.use("/userslist", usersRouter);

// for bookings related routes
app.use("/bookings", bookingRouter);

// for attendance related routes
app.use("/attendance", attendanceRouter);

// for dashboard related routes
app.use("/dashboard", dashboardRouter);

// for enquiries related routes
app.use("/enquiry", enquiryRouter);

app.get("/api/wake-up", (req, res) => {
  return res.send("I am wake up");
});

// starting backend server
app.listen(process.env.PORT_NO, async () => {
    try{
    // connecting with database and redis
    await Promise.all([main(), redisClient.connect()]);
    console.log("Nearest Library Backend Server started at port", process.env.PORT_NO);
    } catch (error) {
        console.log(error.message);
    }
})
