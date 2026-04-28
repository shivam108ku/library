const express = require("express");
const markAttendance = require("../controllers/attendanceRouter/markAttendance");
const fetchAttendance = require("../controllers/attendanceRouter/fetchAttendance");
const attendanceRouter = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const fetchAttendanceForAllUsers = require("../controllers/attendanceRouter/fetchAttendanceForAllUsers");
const markAttendance2 = require("../controllers/attendanceRouter/markAttendance2");

// to mark attendance
attendanceRouter.post("/mark", verifyToken, isAdmin, markAttendance);

//to mark attendance (students path)
attendanceRouter.post("/mark2", verifyToken, markAttendance2);

// fetch attendance records
attendanceRouter.get("/fetch", verifyToken, fetchAttendance);

// fetch attendance records for a specific user (admin only)
attendanceRouter.get("/fetch-user/:userId", verifyToken, isAdmin, fetchAttendance);

// fetch attendance records for all users (admin only)
attendanceRouter.get("/fetch-all", verifyToken, isAdmin, fetchAttendanceForAllUsers);

module.exports = attendanceRouter;