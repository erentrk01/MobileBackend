const mongoose = require("mongoose");
const LikeSchema = new mongoose.Schema({
	user: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: "User",
	  required: true,
	},
	event: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: "Event",
	  required: true,
	},
  });

  const CommentSchema = new mongoose.Schema({
	user: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: "User",
	  required: true,
	},
	content: {
	  type: String,
	  required: true,
	},
  });
  
  
  const FileSchema = new mongoose.Schema({
	filename: {
	  type: String,
	  required: true,
	},
	mimetype: {
	  type: String,
	  required: true,
	},
	size: {
	  type: Number,
	  required: true,
	},
	url: {
	  type: String,
	  required: true,
	},
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
	  building: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Building',
	  },
	  likes:[LikeSchema],
	  comments:[CommentSchema],
	  files: [FileSchema],
	  url:{
		type: String,
	  }
});

const Event = mongoose.model("Event", EventSchema);
exports.Event = Event;
