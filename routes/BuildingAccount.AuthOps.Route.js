//create building account and assign the creator user as a manager of the building  account
const { User } = require("../models/User");
const { Building } = require("../models/Building");

const bcrypt = require("bcryptjs");
const Joi = require("joi");
const passwordComplexity=require("joi-password-complexity");
const generateAuthToken =require("../utils/genAuthToken");

//mail imports
const Token = require("../models/Token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//

const express = require("express");
const saltHashPassword = require("../utils/passwordUtils/saltHashPassword");
const router = express.Router();

// Endpoint:  "/registerBuilding"
router.post("/", async (req, res) => {

	// Building Manager Registration


	// the creator of the building account is automatically assigned as a manager of the building account
	const isManager = true; 

	const schema = Joi.object({
		email: Joi.string().required().email().label("Email"),
		password: passwordComplexity().required().label("Password"),
	  });
	const { error } = schema.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	


	// check whether the user already exists

	
	let user = await User.findOne({email:req.body.email});
	User.findOne({email:req.body.email}, function(err, user) {
		if (err) throw err;
	  
	// object of the user
})
	
	if(user) return res.status(400).send("User already registered");

	// Generate a building ID
	let randomNum=Math.floor(100000 + Math.random() * 900000);
	const buildingId = randomNum.toString();

	let building = await Building.findOne({buildingId:buildingId});

	if(building) return res.status(400).send("Building account creation failed");
	
	
	
	// there is no user with the same email address and building account does not exist
	const save_user = await new User({buildingId:buildingId,name:req.body.name, email:req.body.email, password:req.body.password,isManager:isManager});

	const salt = await bcrypt.genSalt(10);

	save_user.password = await bcrypt.hash(user.password, salt);

	let save_userr = await save_user.save();

	
	//console.log(Math.floor(100000 + Math.random() * 900000));
	// save building information
	
	
	const save_building = await new Building({buildingId:buildingId,buildingName:req.body.buildingName,buildingAddress:req.body.buildingAddress}).save();

	console.log(save_building);

	if (!save_user.verified) {
		let tokenVrf = await Token.findOne({ userId: save_user._id });
		//email verify token
		if (!tokenVrf) {
		  const tokenVrf = await new Token({
			userId: save_user._id,
			token: crypto.randomBytes(12).toString("hex"),
		  }).save();
	
		  const url = `${process.env.BASE_URL}${save_user._id}/verify/${tokenVrf.token}`;
		  // send verify email
		  await sendEmail(save_user.email, "Quickfixr-Verify Email", url);
		}
	  }

	const token = generateAuthToken(save_user);
	res.send(token);

	console.log(" building account manager user registered successfully ");
});

module.exports = router;
