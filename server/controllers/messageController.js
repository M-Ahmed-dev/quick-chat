const MessageModel = require("../models/Message");
const UserModel = require("../models/User");

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
