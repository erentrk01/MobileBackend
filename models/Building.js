const mongoose = require("mongoose");
const {Event} = require("./Event");

const EventSchema = new mongoose.Schema({
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	title:{
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	eventDescription:{
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
	},
	functionalArea: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 60,
	},
	condition:{
		type: String,
		required: true,
	},
	serviceContactPhone: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		//required: true,
	}
});

const BuildingSchema = new mongoose.Schema({
	buildingId:{
		type: String,
		required: true,
	},
	userIDs:{
		type: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
	},
	
	buildingName:{
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	buildingAddress:{
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
	},
	events: [EventSchema]
		

});

const Building = mongoose.model("Building", BuildingSchema);
exports.Building = Building;