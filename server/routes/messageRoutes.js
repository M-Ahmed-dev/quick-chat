const multer = require("multer");
const express = require("express");
const {
  getUsersForSideBar,
  getMessages,
  markMessageAsSeen,
  sendMessage,
} = require("../controllers/messageController");
const { protectRoute } = require("../middleware/auth");
const messageRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

messageRouter.get("/users", protectRoute, getUsersForSideBar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post(
  "/send/:id",
  protectRoute,
  upload.single("image"),
  sendMessage
);

module.exports = messageRouter;
