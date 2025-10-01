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

    const userToken = generateToken(newUser._id);

    return res.status(201).json({
      status: true,
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

// update user profile details

async function updateProfile(req, res) {
  const { profilePic, bio, fullName } = req.body;
  try {
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      await UserModel.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    return res.status(201).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { registerUser, login, updateProfile };
