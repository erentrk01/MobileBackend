//create building account and assign the creator user as a manager of the building  account
const { User } = require("../models/User");
const { Building } = require("../models/Building");
const express = require("express");
const saltHashPassword = require("../utils/passwordUtils/saltHashPassword");
const router = express.Router();


router.post("/registerBuild", async (req, res,next) => {

	// Building Manager Registration

	const { name, email, password,buildingName,buildingAddress,events} = req.body;
	// the creator of the building account is automatically assigned as a manager of the building account
	const isManager = true; 
	
	const plaint_password = password;
	const hash_data =saltHashPassword(plaint_password);
    const save_password = hash_data.passwordHash;//save the hashed password
	var salt = hash_data.salt;//save the salt


	// check whether the user already exists

	let user = User.findOne({email:email})
	if(!user){
		return res.status(400).send("User already registered");
	}
	// there is no user with the same email address
	const save_user = await new User({name, email, save_password,isManager,salt }).save();
	res.status(200).send(save_user);

	console.log(" building account manager user registered successfully ");




  
})
