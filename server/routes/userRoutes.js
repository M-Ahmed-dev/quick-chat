const express = require("express");
const {
  registerUser,
  updateProfile,
} = require("../controllers/userController");
const { checkAuth } = require("../middleware/auth");
const userRouter = express.Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

module.exports = userRouter;
