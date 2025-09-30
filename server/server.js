const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRouter");
require("dotenv").config();

const PORT = process.env.port || 5000;

connectDB();
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
