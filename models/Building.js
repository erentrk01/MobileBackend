const mongoose = require("mongoose");
const BuildingSchema = new mongoose.Schema({
	buildingId:{
		type: Number,
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
	events: [{type:mongoose.Schema.Types.ObjectId,ref:"Event"}]

});

const Building = mongoose.model("Building", BuildingSchema);
exports.Building = Building;