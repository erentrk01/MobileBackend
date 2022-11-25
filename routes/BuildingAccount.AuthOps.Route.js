//create building account and assign the creator user as a manager of the building  account
const { User } = require("../models/User");
const { Building } = require("../models/Building");
const express = require("express");
const saltHashPassword = require("../utils/passwordUtils/saltHashPassword");
const router = express.Router();

//     "/registerBuilding"
router.post("/", async (req, res,next) => {

	// Building Manager Registration

	const { name, email, password,buildingName,buildingAddress} = req.body;
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

	// Generate a building ID
	const buildingId = Math.floor(100000 + Math.random() * 900000);
	console.log(Math.floor(100000 + Math.random() * 900000));
	// save building information
	const save_building = await new Building({buildingId,buildingName,buildingAddress,events}).save();

	if(!save_building){
		return res.status(400).send("Building account creation failed");
	}
	console.log(save_building);
// json response .user and .building
	res.status(200).send({buildingId:buildingId,user:save_user,building:save_building});

	console.log(" building account manager user registered successfully ");

});

module.exports = router;
