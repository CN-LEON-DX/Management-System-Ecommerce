// middlewares/auth.middleware.js
const configSystem = require("../../config/system");
const User = require("../../models/user.model");


module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
    return;
  }
  const user = await User.findOne({
    token: req.tokenUser.token,
  }).select("-password");
  if (!user) {
    res.redirect('/user/login');
    return;
  }
  next();
};
