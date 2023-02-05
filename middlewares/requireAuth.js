const jwt = require("jsonwebtoken");
const mongooose = require("mongoose");
const User = mongooose.model("User");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).send("Access denied. No token provided.");

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }

    const { _id } = decoded;

    const user = await User.findById(_id);
    req.user = user;
    next();
  });
};