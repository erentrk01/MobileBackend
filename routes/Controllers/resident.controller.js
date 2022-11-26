const {Event} = require("../../models/Event");
const {User} = require("../../models/User");
const {Building} = require("../../models/Building");
const express = require("express");
const router = express.Router();

//  Endpoint for creating an event
router.post("/createEvent", async (req, res,next) => {
	// Create Event
	// frontend sends user s email ,buildingId, eventTitle, eventDescription, eventDate,functionalArea ,condition ,serviceContactPhone 
	const { buildingId, email,eventTitle, eventDate, eventDescription,functionalArea,condition,serviceContactPhone} = req.body;
	let user = await User.findOne({email});
	if(!user) return res.status(400).send("User does not exist, event creation failed");
	const userId = user.userId;
	let event = await Event({buildingId,userId,eventTitle, eventDescription,functionalArea,condition,serviceContactPhone}).save();
	if(!event) return res.status(400).send("Event creation failed");
	res.status(200).send({buildingId,userId, eventTitle, eventDate, eventDescription,condition,serviceContactPhone});
	console.log("Event created successfully");

});


module.exports = router;