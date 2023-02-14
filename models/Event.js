const mongoose = require("mongoose");

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

const Event = mongoose.model("Event", EventSchema);
exports.Event = Event;
