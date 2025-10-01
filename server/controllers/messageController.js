const MessageModel = require("../models/Message");
const UserModel = require("../models/User");
const cloudinary = require("../config/cloudinary");

const { io, userSocketMap } = require("../server.js");

//get all users except the logged in user
async function getUsersForSideBar(req, res) {
  try {
    const userId = req.user._id;

    const filteredUsers = await UserModel.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // count number of unseen messages

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await MessageModel.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({
      success: true,
      filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}

// get messages for selectedUser

async function getMessages(req, res) {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await MessageModel.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
      },
      {
        seen: true,
      }
    );

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}

async function markMessageAsSeen(req, res) {
  try {
    const { id } = req.params;

    await MessageModel.findByIdAndUpdate(id, {
      seen: true,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}

async function sendMessage(req, res) {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getUsersForSideBar,
  getMessages,
  markMessageAsSeen,
  sendMessage,
};
