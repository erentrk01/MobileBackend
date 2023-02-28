const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: {  type: Number, default: 0 },
  userIDs: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] },
});

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [OptionSchema], required: true },
  building: {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Building',
	default: [],
	required: true, // Add this line to ensure the reference is not empty,
	default: null, // or undefined
  },
 	owner: { 
	type: mongoose.Schema.Types.ObjectId, 
	ref: 'User', 
	required: true
},
ownerName: { type: String, required: true },
voteCount: { type: Number, default: 0 },
duration: {
    days: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
	minutes: { type: Number, default: 0 },
  },
expiresAt: { type: Date },
isExpired: { type: Boolean, default: false }, 
remainingTime: {
    type: String,
  },
  createdAt: {
	type: Date,
  }


});

const Poll = mongoose.model("Poll", PollSchema);
PollSchema.pre('save', function (next) {
	const now = new Date();
	if (!this.expiresAt) {
	  this.expiresAt = new Date(now.getTime() + this.duration.days * 24 * 60 * 60 * 1000 + this.duration.hours * 60 * 60 * 1000);
	}
	next();
  });
  

exports.Poll = Poll;