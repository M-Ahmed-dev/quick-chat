const UserModel = require("../models/User");
const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  return token;
};

async function registerUser(req, res) {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({
        success: false,
        message: "fullName, email, password and bio are required!",
      });
    }

    const findUser = await UserModel.findOne({ email });

    if (findUser) {
      return res.json({
        status: false,
        message: "User email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      fullName,
      email,
      password: hashPassword,
      bio,
    });

    await newUser.save();

    const userToken = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: userToken,
      userDetails: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        bio: newUser.bio,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const userData = await UserModel.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        message: "Password dosent match!",
      });
    }

    const userToken = generateToken(userData._id);

    return res.status(201).json({
      success: true,
      message: "User logged in successfully",
      token: userToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateProfile(req, res) {
  const { bio, fullName } = req.body;

  try {
    const userId = req.user._id;
    let updatedUser;

    if (req.file) {
      let result;

      if (req.file.buffer) {
        result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profiles", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      }

      console.log("Cloudinary upload result:", result);

      updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { profilePic: result.secure_url, bio, fullName },
        { new: true, runValidators: true }
      );
    } else {
      updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true, runValidators: true }
      );
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { registerUser, login, updateProfile };
