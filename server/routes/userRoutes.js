const express = require("express");
const multer = require("multer");
const {
  registerUser,
  updateProfile,
  login,
} = require("../controllers/userController");
const { checkAuth, protectRoute } = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const userRouter = express.Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", login);
userRouter.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);
userRouter.get("/check", protectRoute, checkAuth);

module.exports = userRouter;
