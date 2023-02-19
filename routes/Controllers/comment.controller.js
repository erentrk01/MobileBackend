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



  //Comment

  // Create a new comment for an event
  router.post("/events/:eventId/comments", async (req, res) => {
	console.log(req.params.eventId)
	const { content} = req.body;

  
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
			return res.status(404).send({
			  status: "error",
			  message: "Invalid Event ID",
			});
		  }


	  const event = await Event.findById(req.params.eventId);
	  if (!event) {
		return res.status(404).send({
		  status: "error",
		  message: "Event not found",
		});
	  }
  
	  const comment = new Comment({
		user: event.userId,
		content,
	  });
	  await comment.save()
	  event.comments.push(comment);
	  await event.save();
  
	  res.send({
		status: "success",
		message: "Comment created",
		data: comment,
	  });
	} catch (error) {
	  console.log(error);
	  res.status(500).send({
		status: "error",
		message: "Something went wrong",
	  });
	}
  });

  // Get all comments for an event
router.get("/events/:eventId/comments", async (req, res) => {
	try {
		const eventId = req.params.eventId;
	
		// Find the event by ID
		const event = await Event.findById(eventId);
	
		if (!event) {
		  return res.status(404).send({
			status: "error",
			message: "Event not found",
		  });
		}
	
		// Find the comments for the event
		const comments = await Comment.find({
		  _id: { $in: event.comments }
		}).populate("user");
	
		res.status(200).send({
		  status: "success",
		  comments,
		});
	  } catch (error) {
		console.error(error);
		res.status(500).send({
		  status: "error",
		  message: "Server error",
		});
	  }
  });


  // Delete a comment for an event
router.delete("/events/:eventId/comments/:commentId", async (req, res) => {
	const { eventId, commentId } = req.params;
  
	try {
	  if (!mongoose.Types.ObjectId.isValid(eventId)) {
		return res.status(404).send({
		  status: "error",
		  message: "Invalid Event ID",
		});
	  }
  
	  const event = await Event.findById(eventId);
	  if (!event) {
		return res.status(404).send({
		  status: "error",
		  message: "Event not found",
		});
	  }
  
	  const comment = await Comment.findById(commentId);
	  if (!comment) {
		return res.status(404).send({
		  status: "error",
		  message: "Comment not found",
		});
	  }
  
	  if (comment.user.toString() !== event.userId.toString()) {
		return res.status(401).send({
		  status: "error",
		  message: "You are not authorized to delete this comment",
		});
	  }
  
	  await Comment.deleteOne({ _id: commentId });
	  event.comments = event.comments.filter((c) => c.toString() !== commentId);
	  await event.save();
  
	  res.send({
		status: "success",
		message: "Comment deleted",
		data: comment,
	  });
	} catch (error) {
	  console.log(error);
	  res.status(500).send({
		status: "error",
		message: "Something went wrong",
	  });
	}
  });


  module.exports = router;