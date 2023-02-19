const {Event} = require("../../models/Event");
const {User} = require("../../models/User");
const {Token}= require("../../models/token");
const {Building} = require("../../models/Building");
const {Like} = require("../../models/Like");
const {Comment} = require("../../models/Comment");

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireAuth = require("../../middlewares/requireAuth");
const _ = require('lodash');
const shortid = require('shortid');



//  Endpoint for creating an event
router.post("/createEvent",requireAuth,async (req, res,next) => {
	// Create Event
	// frontend sends user s email ,buildingId, eventTitle, eventDescription, eventDate,functionalArea ,condition ,serviceContactPhone 
	const { buildingId, email,title, eventDate, eventDescription,functionalArea,condition,serviceContactPhone} = req.body;
	console.log("istek gönderildi");
	console.log("buildingId value:"+buildingId);
	console.log("email value:"+email);
	let user = await User.findOne({email});
	if(!user) return res.status(400).send("User does not exist, event creation failed");
	const userId = user._id;
	let date = new Date();
	date= date.toString();
	let event = await Event({buildingId,userId,title, eventDescription,functionalArea,condition,serviceContactPhone,date}).save();
	
	
	if(!event) return res.status(400).send("Event creation failed");
	const building = await Building.findOne({buildingId});

  if (!building) {
    return res.status(404).json({ message: 'Building not found' });
  }
  building.events.push(event);
  await building.save();

  return res.status(201).json(event);
	

});

//! @route DELETE /deleteFile/:id
//! @desc Delete a file from DB
router.delete("/deleteEvent/:id/:buildingId" ,requireAuth,async (req, res,next) => {
	console.log("delete event request received")
	const id = req.params.id;
	const buildingId = req.params.buildingId;

	const _id = new mongoose.Types.ObjectId(id);
//
	
		const event = await Event.findByIdAndRemove(_id);
		if (!event) return res.status(404).send({ error: 'Event not found' });

	
	//
	try{
		const building = await Building.findOneAndUpdate(
			{ buildingId },
			{ $pull: { events: { _id } } },
			{ new: true }
		  );
		
		  if (!building) {
			return res.status(404).json({ message: 'Building not found' });
		  }

		  return res.status(201).json(building);
	
	}catch(err){
		return res.status(500).send("Event Delete failed");
	}
});

//! @route GET /fetchEvents
//! @desc Fetch all events array of a building from DB
router.get("/fetchEvents/:buildingId",async (req, res,next) => {
	
  try {
	// email and buildingId are sent from frontend
	// output two dim array
	let query = req.query.q; // the search query from the frontend
	let buildingId = req.params.buildingId;
	let page = parseInt(req.query.page) || 1; // the current page, defaulting to 1
	const pageSize = 5; // the number of events to include on each page
  //

    let events = await Event.find({ buildingId })
      .populate("likes")
	  .populate("userId")
      .exec();

	  if (query) {
		const regex = new RegExp(query, "i"); // create a case-insensitive regex from the query string
		events = events.filter((event) => {
		  return regex.test(event.title) || regex.test(event.eventDescription);
		});
	  }
	
	  //
	  const condition = req.query.condition;
  const functionalArea = req.query.functionalArea;
  console.log(condition)

  if (condition) {
    events = events.filter((event) => event.condition === condition);
  }

  if (functionalArea) {
    events = events.filter((event) => event.functionalArea === functionalArea);
  }

	


	  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedEvents = events.slice(startIndex, endIndex);
  console.log(pagedEvents)

  return res.status(200).json({
    events: pagedEvents.reverse(),
    currentPage: page,
    totalPages: Math.ceil(events.length / pageSize),
	conditionFilter:condition,
	functionalAreaFilter:functionalArea
  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
	
//*/
/*	let building= await Building.findOne({ buildingId }).populate('events');
	// send the building events array
	if(building == null) return res.status(400).send("No building founded with this id ");
	//console.log("building events:" + buildingEvents);
	console.log(building.events)
	
	let events = building.events;
	*/
	
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
router.get("/getResidents/:buildingId",requireAuth, async (req, res,next) => {
	//  buildingId is sent from frontend
	

	const buildingId = req.params.buildingId;
	

	let buildingResidents = await Building.find({buildingId}).select('userIDs');
	if(!buildingResidents)  return res.status(400).send("No building founded with this id ");
	const items = Object.values(buildingResidents).map((value)=>value.events);
	//var  building.events=[];
	for(var i=0;i<items.length;i++){
		let event = await User.find({_id:items[0][i]});
		if(event == null) return res.status(400).send("No event founded with this id ");
	building.events.push(event);
	}
		
	console.log("building residents:" + buildingResidents);
	res.status(200).json({residents:building.events});
});

router.get("/:id/verify/:token", async (req, res) => {
	try {
	  console.log("heyy");

	  const user = await User.findOne({ _id: req.params.id });
	  if (!user) return res.status(400).send({ message: "Invalid Link" });
	  console.log(user);
	  console.log(req.params.token);
	  console.log(typeof req.params.token);
	  //console.log(mongoose.Types.ObjectId(req.params.token));
	  console.log(Token);
	  const token = await Token.findOne({
		userId: user._id,
		token: req.params.token,
	  });
	  console.log("token findounu geçti");
	  console.log(token);
  
	  if (!token) return res.status(400).send({ message: "Invalid Link" });
  
	  await User.updateOne({ _id: user._id }, { verified: true });
  
	  console.log("updateyi geçti");
	  console.log(user);
	  console.log(user.verified);
	  await token.remove();
	  let usr = await User.findOne({ _id: req.params.id });
  
	  res
		.status(200)
		.send({ message: "Account Verified", verified: usr.verified });
	} catch (err) {
	  console.log(err);
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });

  router.get("/building/:buildingId", async (req, res) => {
	//  buildingId is sent from frontend
	const building = await Building.findOne({buildingId:req.params.buildingId})
	if(!building) return res.status(400).send("No building founded with this id ");
	res.status(200).json({building:building});
  })



  

module.exports = router;
