//create user account under an existing building account
const { User } = require("../models/User");
const { Building } = require("../models/Building");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const saltHashPassword = require("../utils/passwordUtils/saltHashPassword");
const checkHashPassword = require("../utils/passwordUtils/checkHashPassword");

// Endpoint:	 "/registerUser"
router.post("/registerUser", async (req, res,next) => {

	// User Registration

	
	const buildingId=   req.body.buildingId;
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	// the creator of the building account is automatically assigned as a manager of the building account
	const isManager = false;
	const plaint_password = password;
	const hash_data =saltHashPassword(plaint_password);
	const save_password = hash_data.passwordHash;//save the hashed password
	var salt = hash_data.salt;//save the salt
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
	let user = new User({
		name: name,
	buildingId:buildingId,
	email: email,
	password: save_password,
	salt:salt,
	isManager:isManager
	});


	user = await user.save();



	res.status(200).send({message:"succesful reg",user:user});

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
	// Hash user password with salt, if hash data equals to password, then login success
	let hashedPassword = checkHashPassword(password, salt).passwordHash;
	let encryptedPassword = user.password;
	if (hashedPassword === encryptedPassword) return res.status(200).send({message:"login success",user:user});
	console.log("password is wrong");
	return res.status(400).send("password is wrong");
	//
});


module.exports = router;
