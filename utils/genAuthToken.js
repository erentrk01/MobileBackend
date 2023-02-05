const jwt = require("jsonwebtoken");

const genAuthToken = (user) => {
  const secretKey = process.env.JWT_SECRET;

  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      verifyStatus: user.verified,
	  buildingCode:user.buildingId

    },
    secretKey
  );

  return token;
};

module.exports = genAuthToken;