const {Event} = require("../../models/Event");
const {User} = require("../../models/User");
const {Building} = require("../../models/Building");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//  Endpoint for creating an event
router.post("/createEvent", async (req, res,next) => {
	// Create Event
	// frontend sends user s email ,buildingId, eventTitle, eventDescription, eventDate,functionalArea ,condition ,serviceContactPhone 
	const { buildingId, email,eventTitle, eventDate, eventDescription,functionalArea,condition,serviceContactPhone} = req.body;
	console.log("istek gönderildi");
	console.log("buildingId value:"+buildingId);
	console.log("email value:"+email);
	let user = await User.findOne({email});
	if(!user) return res.status(400).send("User does not exist, event creation failed");
	const userId = user.userId;
	let event = await Event({buildingId,userId,eventTitle, eventDescription,functionalArea,condition,serviceContactPhone}).save();
	
	if(!event) return res.status(400).send("Event creation failed");
	res.status(200).send({buildingId,userId, eventTitle, eventDate, eventDescription,condition,serviceContactPhone});
	console.log("event id:"+ event._id);
		const building= await Building.findOneAndUpdate({buildingId},{
			$push: {events:{_id:new mongoose.Types.ObjectId(event._id),
				eventTitle:event.eventTitle,
				eventDescription:event.eventDescription,
				functionalArea:event.functionalArea,
				condition:event.condition,
		
			}}
	});

		
		console.log("Event created successfully pushed into building events array");
		if(!building) return res.status(400).send("Event push  failed");
		console.log("building event array:"+building.events);
	

});

//! @route DELETE /deleteFile/:id
//! @desc Delete a file from DB
router.delete("/deleteEvent/:id", async (req, res,next) => {
	const id = req.params.id;
	if (!id || id === "undefined") return res.status(400).send("No File ID");
	const _id = new mongoose.Types.ObjectId(id);
	const file = await Event.findOneAndDelete({ eventId: _id });
	if (!file) return res.status(400).send("No File Found");

	await Event.findByIdAndDelete(id);
	res.status(202).send("Event Deleted");
});

//! @route GET /fetchEvents
//! @desc Fetch all events array of a building from DB
router.get("/fetchEvents/:buildingId", async (req, res,next) => {
	// email and buildingId are sent from frontend
	// output two dim array

	const buildingId = req.params.buildingId;
	

	let buildingEvents = await Building.find({ buildingId }).select('events');
	// send the building events array
	if(buildingEvents == null) return res.status(400).send("No building founded with this id ");
	console.log("building events:" + buildingEvents);
	
	const items = Object.values(buildingEvents).map((value)=>value.events);
	var  itemObjects=[];
	for(var i=0;i<items[0].length;i++){
		let event = await Event.find({_id:items[0][i]});
		if(event == null) return res.status(400).send("No event founded with this id ");
	itemObjects.push(event);
		
	}
	
	console.log(itemObjects);
	res.status(200).json({events:itemObjects});

	
	
	

});

//! @route GET /getEvent/:eventId
//! @desc Fetch a event from DB

router.get("getEvent/:eventId", async (req, res,next) => {
	const eventId = req.params.eventId;
	if (!eventId || eventId === "undefined") return res.status(400).send("No File ID");

	const _id = new mongoose.Types.ObjectId(eventId);
	const event = await Event.findOne({eventId});
	if (!event) return res.status(400).send("No Event Found with this id");
	res.status(200).json(event);

  
});

//! @route GET /getResidents/:buildingId
//! @desc Fetch all residents of  the building matching requested building Id from DB
router.get("/getResidents/:buildingId", async (req, res,next) => {
	//  buildingId is sent from frontend
	

	const buildingId = req.params.buildingId;
	

	let buildingResidents = await Building.find({buildingId}).select('userIDs');
	if(!buildingResidents)  return res.status(400).send("No building founded with this id ");
	const items = Object.values(buildingResidents).map((value)=>value.events);
	var  itemObjects=[];
	for(var i=0;i<items.length;i++){
		let event = await User.find({_id:items[0][i]});
		if(event == null) return res.status(400).send("No event founded with this id ");
	itemObjects.push(event);
	}
		
	console.log("building residents:" + buildingResidents);
	res.status(200).json({residents:itemObjects});
});


module.exports = router;