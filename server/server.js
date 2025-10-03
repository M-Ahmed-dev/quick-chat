require("dotenv").config();
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.port || 5000;

//initialize socket server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = {};

// Export early to avoid circular dependency issues
module.exports = { io, userSocketMap };

const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connected ", userId);

  if (userId) userSocketMap[userId] = socket.id;
  // emit online users to all

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected!");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

connectDB();
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
