const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(`Database is connected ${mongoose.connection.host}`);
    });

    await mongoose.connect(`${process.env.MONGO_DB_URL}/chat-app`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
