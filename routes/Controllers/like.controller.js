const {Event} = require("../../models/Event");
const {User} = require("../../models/User");
const {Token}= require("../../models/token");
const {Building} = require("../../models/Building");
const {Like} = require("../../models/Like");
const {Comment} = require("../../models/Comment");

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireAuth = require("../../middlewares/requireAuth");
const _ = require('lodash');


router.put("/events/:eventId/like", async (req, res) => {
	try {
		const event = await Event.findById(req.params.eventId);
		const email = req.body.email;

		const user =await User.findOne({email})
		if (!user) return res.status(400).send("User does not exist");


		// Check if user has already liked the event
		const existingLike = await Like.findOne({ user: user._id, event: req.params.eventId });
		if (existingLike) {
			return res.status(400).send({
				status: "error",
				message: "User has already liked this event",
			});
		}


		
		const like = new Like({ user: user._id, event: event._id });
		await like.save();
		event.likes.push(like);
		await event.save();
		res.status(200).send({
		  status: "success",
		  message: "the event has been liked",
		});
	  } catch (err) {
		res.status(500).json({ error: err.message });
	  }
});

router.put("/events/:eventId/unlike", async (req, res, next) => {
 try {
    console.log("UNLIKE HITTED")
    const eventId = req.params.eventId;
    if (!eventId || eventId === "undefined") {
      return res.status(400).send("No Event ID provided");
    }
    
    const email = req.body.email; // assuming user is authenticated and their ID is in the request object
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User does not exist");
    }

    const userId = user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("No Event found with this ID");
    }

   // Check if user has already liked the event
		const existingLikeIndex = event.likes.findIndex(like => like.user.toString() === userId.toString() && like.event.toString() === eventId);
		if (existingLikeIndex === -1) {
			return res.status(400).send({
				status: "error",
				message: "User has not liked this event",
			});
		}
    event.likes.splice(existingLikeIndex, 1);
    await event.save();
    res.status(200).send({
      status: "success",
      message: "The event has been unliked",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  });

  module.exports = router;