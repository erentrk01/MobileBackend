const mongoose = require("mongoose");
const FileSchema = new Schema({
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

  const File = mongoose.model("File", FileSchema);
	exports.File = File;

