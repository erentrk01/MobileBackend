const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
	buildingId:{
		type:String
	},
	name:{
		type: String,
		required: true,
		minlength: 3,
		maxlength: 30,
		unique:false,
	
	},
	email:{
		type: String,
		unique: true,
		required: true,
		minlength: 5,
		maxlength: 255,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 1024,

	  },
	isManager: {
		type: Boolean,
		default: false,

	},
	salt:{
		type: String,
		required: true,
	}
});

const User = mongoose.model("User", UserSchema);



exports.User = User;
