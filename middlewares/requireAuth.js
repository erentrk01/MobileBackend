const jwt = require("jsonwebtoken");
const mongooose = require("mongoose");
const User = mongooose.model("User");
const { verifyAccessToken, verifyRefreshToken } = require("../utils/jwt.utils");

module.exports = async (req, res, next) => {

	try {
		const { authorization } = req.headers;

		if (!authorization)
		  return res.status(401).send("Access denied. No token provided.");
	  
		const accessToken = authorization.replace("Bearer ", "");
		
		req.user= verifyAccessToken(accessToken)
		next();
	} catch (e) {
		return res.status(401).json(e);
	}



};