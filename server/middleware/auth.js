import UserModel from "../models/User";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found!",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  checkAuth,
  protectRoute,
};
