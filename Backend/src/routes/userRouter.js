const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const addNewUser = require("../controllers/usersRouter/addNewUser");
const isAdmin = require("../middlewares/isAdmin");
const getUsers = require("../controllers/usersRouter/getUsers");
const sendOtpForRegistration = require("../controllers/usersRouter/sendOtpForRegisteration");
const verifyOtpAndRegisterUser = require("../controllers/usersRouter/verifyOtpAndRegisterUser");
const sendOtpForLoginUser = require("../controllers/usersRouter/sendOtpForLoginUser");
const verifyOtpAndLoginUser = require("../controllers/usersRouter/verifyOtpAndLoginUser");
const verifyRegisterationOtp = require("../middlewares/verifyRegisterationOtp");
const verifyLoginOtp = require("../middlewares/verifyLoginOtp");
const authenticateUserOnMount = require("../controllers/usersRouter/authenticateUserOnMount");
const logoutUser = require("../controllers/usersRouter/logoutUser");
const editUserProfile = require("../controllers/usersRouter/editUserProfile");
const uploadProfilePicture = require("../controllers/usersRouter/uploadProfilePicture");
const getUserBookings = require("../controllers/usersRouter/getUserBookings");
const getAllUsers = require("../controllers/usersRouter/getAllUsers");
const getUser = require("../controllers/usersRouter/getUser");
const getUserBookingsWithPagination = require("../controllers/usersRouter/getUserBookingsWithPagination");
const loginUser = require("../controllers/usersRouter/loginUser");
const upload = require("../config/multer");
const deleteUserAndRelatedData = require("../controllers/usersRouter/deleteUserAndRelatedData");
const userRouter = express.Router();


// to add new user
userRouter.post("/add", verifyToken, isAdmin, addNewUser);

// to send otp for registration
userRouter.post("/register/send-otp", sendOtpForRegistration);

// to verify otp and register user
userRouter.post("/register/verify-otp", verifyRegisterationOtp, verifyOtpAndRegisterUser);

// to send otp for login user
userRouter.post("/login/send-otp", sendOtpForLoginUser);

// to verify otp and login user
userRouter.post("/login/verify-otp", verifyLoginOtp, verifyOtpAndLoginUser);   

// to login user using password
userRouter.post("/login", loginUser); 

// to authenticate user on app mount
userRouter.get("/authenticate", verifyToken, authenticateUserOnMount);  

// user logout
userRouter.post("/logout", verifyToken, logoutUser);

// edit user profile - general info
userRouter.put("/:userId/profile/edit", verifyToken, editUserProfile);

// Use 'profileImage' as the key, consistent with frontend
userRouter.put("/profile-image/:userId", verifyToken, upload.single("profileImage"), uploadProfilePicture);

// to get user past bookings - can be used in user profile page
userRouter.get("/:userId/bookings/list", verifyToken, getUserBookingsWithPagination);

// to get all users with pagination
userRouter.get("/list", verifyToken, isAdmin, getUsers);

// to get all user's username, contactNo and userId
userRouter.get("/all", verifyToken, isAdmin, getAllUsers);

// to get user by id
userRouter.get("/:userId", verifyToken, isAdmin, getUser);

// to delete a user and related data
userRouter.delete("/:userId", verifyToken, isAdmin, deleteUserAndRelatedData);

module.exports = userRouter;