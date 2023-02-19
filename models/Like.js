const mongoose = require("mongoose");
const {Event} = require("./Event");

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
  const Like= mongoose.model("Like", LikeSchema);
exports.Like= Like;