//create user account under an existing building account
const { User } = require("../models/User");
const { Building } = require("../models/Building");

const bcrypt = require("bcryptjs");
const Joi = require("joi");
const passwordComplexity=require("joi-password-complexity");
const generateAuthToken =require("../utils/jwt.utils");

//mail imports
const {Token} = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();


// Endpoint:	 "/registerUser"
router.post("/registerUser", async (req, res,next) => {

	// User Registration

	
	const buildingId=   req.body.buildingId;
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	// the creator of the building account is automatically assigned as a manager of the building account
	const isManager = false;

	const schema = Joi.object({
		email: Joi.string().required().email().label("Email"),
		name:Joi.string().required().max(30),
		password: passwordComplexity().required().label("Password"),
	  });
	  const { error } = schema.validate(req.body)
	  if (error) return res.status(400).send(error.details[0].message);

	

	// check whether the user already exists
	console.log(email);

	User.findOne({email:email},function(err,user){
	// there is no user with the same email address
		if(user){
			return res.status(400).send("User already registered");
			console.log("User already registered");
		}});

	
	console.log("buildingID: "+buildingId);

	 let building = await Building.findOne({buildingId:buildingId});
	 if(!building) return res.status(400).send("Building account does not exist,register failed");
	

			// create a new user
	const  user = new User({
		name: name,
	buildingId:buildingId,
	email: email,
	password: save_password,
	salt:salt,
	isManager:isManager
	});

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	 let usr = await user.save();

	 if (!usr.verified) {
		let tokenVrf = await Token.findOne({ userId: usr._id });
		//email verify token
		if (!tokenVrf) {
		  const tokenVrf = await new Token({
			userId: usr._id,
			token: crypto.randomBytes(12).toString("hex"),
		  }).save();
	
		  const url = `${process.env.BASE_URL}${usr._id}/verify/${tokenVrf.token}`;
		  // send verify email
		  await sendEmail(usr.email, "Netcad3d-Verify Email", url);
		}
	  }



	  const token = generateAuthToken(user);
	  res.send(token);

	console.log("user registered successfully under a building account ");

});



router.post("/loginUser", async (req, res) => {
	console.log("login user hitted")

	const password = req.body.password;
	console.log("password: "+password);

	
	let user = await User.findOne({ email:req.body.email });
	if(!user) return res.status(400).send("user mail or password is wrong");
	
	console.log(user);
	
	//console.log(user.salt);
	const salt = user.salt;
	const bid=user.buildingId;
	
	// Hash user password with salt, if hash data equals to password, then login success
	let hashedPassword = checkHashPassword(password, salt).passwordHash;
	let encryptedPassword = user.password;
	if (hashedPassword === encryptedPassword) return res.status(200).send({buildingId:bid,message:"login success",user:user});
	console.log("password is wrong");
	return res.status(400).send("password is wrong");
	//
});


module.exports = router;
