//create building account and assign the creator user as a manager of the building  account
const { User } = require("../models/User");
const { Building } = require("../models/Building");
const express = require("express");
const saltHashPassword = require("../utils/passwordUtils/saltHashPassword");
const router = express.Router();

//     "/registerBuilding"
router.post("/", async (req, res) => {

	// Building Manager Registration


	// the creator of the building account is automatically assigned as a manager of the building account
	const isManager = true; 
	
	
	const plaint_password = req.body.password;
	const hash_data =saltHashPassword(plaint_password);
    const save_password = hash_data.passwordHash;//save the hashed password
	var salt = hash_data.salt;//save the salt
	console.log(req.body.name);
	console.log(req.body);

	// check whether the user already exists

	
	try {
		let user = User.findOne({email:req.body.email});
		let save_user =  new User({name:req.body.name, email:req.body.email, password:save_password,isManager:isManager,salt:salt });
			
		if(!user){
			return res.status(400).send("User already registered");
		}else{
			// there is no user with the same email address
			save_user =save_user.save();
		}
		
	
	

	// Generate a building ID
	const buildingId = Math.floor(100000 + Math.random() * 900000);
	console.log(Math.floor(100000 + Math.random() * 900000));
	// save building information
	const save_building = await new Building({buildingId:buildingId,buildingName:req.body.buildingName,buildingAddress:req.body.buildingAddress}).save();

	if(!save_building){
		return res.status(400).send("Building account creation failed");
	}
	console.log(save_building);
// json response .user and .building
	res.status(200).send({buildingId:buildingId,user:save_user,building:save_building});

	console.log(" building account manager user registered successfully ");
} catch (error) {
	res.status(400).send(error + " Problem occured");
}
});

module.exports = router;
