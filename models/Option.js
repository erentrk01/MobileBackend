const mongoose = require("mongoose");
const OptionSchema = new mongoose.Schema({
	text: { type: String, required: true },
	votes: { type: Number, default: 0 },
	userIDs: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] },
  });
  


const Option = mongoose.model("Option", OptionSchema);

exports.Option = Option;