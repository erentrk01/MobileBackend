const mongoose = require("mongoose");
const {Event} = require("./Event");

const OptionSchema = new mongoose.Schema({
	text: { type: String, required: true },
	votes: { type: Number, default: 0 },
	percentage: { type: Number, default: 0 },
	userIDs: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] },
  });
  
  const PollSchema = new mongoose.Schema({
	question: { type: String, required: true },
	options: { type: [OptionSchema], required: true },
	building: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Building',
		default: [],
		required: true, // Add this line to ensure the reference is not empty
		default: null, // or undefined
	  },
	  owner: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User', 
		required: true 
	},
	duration: {
		days: { type: Number, default: 0 },
		hours: { type: Number, default: 0 },
		minutes: { type: Number, default: 0 },
	  },
	expiresAt: { type: Date },
	isExpired: { type: Boolean, default: false }, 
	ownerName: { type: String, required: true },
	voteCount: { type: Number, default: 0 },
	remainingTime: {
		type: String,
	  },
	  createdAt: {
		type: Date,
	  }
  });

  
PollSchema.pre('save', function (next) {
	const now = new Date();
	if (!this.expiresAt) {
	  this.expiresAt = new Date(now.getTime() + this.duration.days * 24 * 60 * 60 * 1000 + this.duration.hours * 60 * 60 * 1000);
	}
	next();
  });
  

  
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
	},
	expiresAt: { type: Date },
	isExpired: { type: Boolean, default: false },
});

PollSchema.pre('save', function (next) {
	const now = new Date();
	if (!this.expiresAt) {
	  this.expiresAt = new Date(now.getTime() + this.duration.days * 24 * 60 * 60 * 1000 + this.duration.hours * 60 * 60 * 1000);
	}
	next();
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
	polls:[PollSchema],
	events: [EventSchema],

		

});

const Building = mongoose.model("Building", BuildingSchema);
exports.Building = Building;