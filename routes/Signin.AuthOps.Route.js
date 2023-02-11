const bcrypt = require("bcryptjs");
const Joi = require("joi");
const express = require("express");

const { User } = require("../models/User");
const generateAuthToken = require("../utils/jwt.utils");
const { genAccessToken, genRefreshToken } =require("../utils/jwt.utils");

//mail imports
const Token=require("../models/token");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");
//
const router = express.Router();

let refreshTokens = [];
router.post("/signin", async (req, res) => {
	const schema = Joi.object({
	  email: Joi.string().min(5).max(255).required().email().messages({
		"string.base": "Email must be a string",
		"string.min": "Email en az 5 karakter olmalıdır",
		"string.max": "Email en fazla 255 karakter olmalıdır",
		"string.email": "Geçerli bir email adresi giriniz",
		"string.empty": "Email alanı boş bırakılamaz",
		"any.required": "Email alanı boş bırakılamaz",
	  }),
	  password: Joi.string().min(6).max(1024).required().messages({
		"string.base": "Password must be a string",
		"string.min": "Şifre en az 6 karakter olmalıdır",
		"string.max": "Şifre en fazla 1024 karakter olmalıdır",
		"string.empty": "Şifre alanı boş bırakılamaz",
		"any.required": "Şifre alanı boş bırakılamaz",
	  }),
	});
	const { error } = schema.validate(req.body);
  
	if (error) return res.status(400).send(error.details[0].message);
  
	let user = await User.findOne({ email: req.body.email });
  
	if (!user) return res.status(400).send("Yanlış email veya şifre");
  
  
	const isValidPassword = await bcrypt.compare(
	  req.body.password,
	  user.password
	);
  
	if (!isValidPassword) return res.status(400).send("Yanlış email veya şifre");
  
  //logged in successfully

	  console.log(user.verified);
	  if(!user.verified)
	  res.status(400).write("An Email sent to your account ,please verify your email first");
  
	  const accessToken = genAccessToken(user);
	  const refreshToken = genRefreshToken(user);


  		// Set refersh token in refreshTokens array
 		refreshTokens.push(refreshToken);
		
  
	res.status(200).send({ user, accessToken, refreshToken })
	
  });

 // Create new access token from refresh token
router.post("/token", async (req, res) => {
 const { refreshToken } = req.headers;

  
	// If token is not provided, send error message
	if (!refreshToken) {
	  res.status(401).json({
		errors: [
		  {
			msg: "Token not found",
		  },
		],
	  });
	}
  
	// If token does not exist, send error message
	if (!refreshTokens.includes(refreshToken)) {
	  res.status(403).json({
		errors: [
		  {
			msg: "Invalid refresh token",
		  },
		],
	  });
	}
  
	try {
	  const user = await JWT.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET_KEY
	  );
	  // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
	  const { email } = user;
	  const accessToken = await JWT.sign(
		{ email },
		process.env.JWT_SECRET,
		{ expiresIn: "1h" }
	  );
	  res.json( accessToken );
	} catch (error) {
	  res.status(403).json({
		errors: [
		  {
			msg: "Invalid token",
		  },
		],
	  });
	}
  });

  // Deauthenticate - log out
// Delete refresh token
router.delete("/logout", (req, res) => {
	const refreshToken = req.headers
  
	refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
	res.sendStatus(204);
  });
  
  
  module.exports = router;