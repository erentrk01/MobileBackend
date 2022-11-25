//create user account under an existing building account
const { User } = require("../models/User");
const { Building } = require("../models/Building");
const express = require("express");
const router = express.Router();
const saltHashPassword = require("../utils/passwordUtils/saltHashPassword");

// Endpoint:	 "/registerUser"
router.post("/", async (req, res,next) => {

	// User Registration

	const { buildingID,name, email, password} = req.body;
	// the creator of the building account is automatically assigned as a manager of the building account
	const isManager = false;
	const plaint_password = password;
	const hash_data =saltHashPassword(plaint_password);
	const save_password = hash_data.passwordHash;//save the hashed password
	var salt = hash_data.salt;//save the salt
	// check whether the user already exists

	let user = User.findOne({email:email})
	if(!user){
		return res.status(400).send("User already registered");
		console.log("User already registered");
	}
	// there is no user with the same email address

	 let building =Building.findOne({buildingId:buildingID});
	 if(!building){
		return res.status(400).send("Building account does not exist,register failed");
	 }

	const save_user = await new User({buildingId,name, email, save_password,isManager,salt }).save();

	res.status(200).send({buildingId:buildingId,user:save_user,building:save_building});

	console.log("user registered successfully under a building account ");

});

module.exports = router;