const express = require("express");
const { Building } = require("../../models/Building");
const {User} = require("../../models/User");
const router = express.Router();
const {Poll} = require("../../models/Poll");
const {Option} = require("../../models/Option");
const mongoose = require("mongoose");


router.post("/poll/:buildingId/create", async (req, res) => {
	try {
	  const { question, options, userId, days, hours } = req.body;
	  const buildingId = req.params.buildingId;
	  const building = await Building.findOne({ buildingId })
	  if (!building) return res.status(404).send('Building not found');
	  const user = await User.findById(userId);
	  if (!user) return res.status(404).send('User not found');
  
	  if (!Array.isArray(options) || options.length < 2) {
		return res.status(400).send('Poll must have at least 2 options');
	  }
  
	  // Map the options array to an array of Option documents
	  const optionsDocs = options.map((option, i) => new Option({
		text: option,
		votes: 0,
		userIDs: []
	  }));
  
	  const bId = new mongoose.Types.ObjectId(building._id);
	  const owner = new mongoose.Types.ObjectId(userId);
	  console.log(" days:"+ days)
	  let date = new Date();
	  let remainingTime;
	  if(days<=0)
	 { 	if(hours > 1)
		remainingTime = `${hours} hours`;
		else 
		remainingTime = `${hours} hour`;
	}
	  else if (days === 1)
	  {if(hours === 0)
		remainingTime = `${days} day`;
		else
		remainingTime = `${days} day ${hours} hours`;
	}
	  else
	  remainingTime = `${days} days ${hours} hours`;


	  
  
	  const poll = await Poll({
		question,
		options: optionsDocs,
		building: bId,
		owner,
		ownerName: user.name,
		duration: {
		  days,
		  hours,
		},
		 remainingTime,
		createdAt: date,
	  }).save();
  
	  building.polls.push(poll);
	  await building.save();
	  res.json(poll);
	} catch (error) {
	  console.error(error);
	  res.status(500).send("Server error");
	}
  });

router.get("/polls/:buildingId", async (req, res) => {
	try {
		const { buildingId } = req.params;

		const building = await Building.findOne({buildingId}).populate({
			path: "polls.options",
			populate: { path: "userIDs" }
		  });

	
		if (!building) {
		  return res.status(404).json({ error: "Building not found" });
		}
		return res.json(building.polls.reverse());
	  } catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	  }
	});

	router.delete("/poll/:pollId/delete/:userId", async (req, res) => {
		const { pollId ,userId} = req.params;
		const building = await Building.findOne({ "polls._id": pollId });
		if (!building) {
		  return res.status(404).send("Building not found");
		}
		const poll = building.polls.id(pollId);
		if (!poll) {
		  return res.status(404).send("Poll not found");
		}
		console.log("userId:"+userId)
		if (poll.owner.toString() !== userId) {
		  return res.status(403).send({error:"Only the owner can delete this poll"});
		}
		poll.remove();
		await building.save();
		await Promise.all(
		  poll.options.map(async (option) => {
			await Option.findByIdAndDelete(option._id);
		  })
		);
		return res.status(200).send("Poll deleted successfully");
	  });
	  



// Get a poll by ID

router.get("poll/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Calculate total vote count
    const totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);

    // Calculate vote percentage for each option
    const optionsWithPercentages = poll.options.map((option) => ({
      text: option.text,
      votes: option.votes,
      percentage: totalVotes === 0 ? 0 : (option.votes / totalVotes) * 100,
    }));

    res.json({ question: poll.question, options: optionsWithPercentages });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
//vote for an option in a poll
router.post("/poll/:pollId/vote/:optionId", async (req, res) => {
	try {
		const { pollId, optionId } = req.params;
		const { userId } = req.body;
		
	
		const building = await Building.findOne({ "polls._id": pollId }).populate(
		  "polls.options.userIDs"
		);
		if (!building) {
		  return res.status(404).json({ error: "Poll not found" });
		}
	
		const poll = building.polls.id(pollId);
		const option = poll.options.id(optionId);
		if(poll.isExpired) return res.status(400).json({error:"Voting period ended for this poll"});
	
		if (!option) {
		  return res.status(404).json({ error: "Option not found" });
		}
	
		const oldOption = poll.options.find((o) => o.userIDs.find((id) => id.equals(userId)));
	
		if (oldOption && !oldOption._id.equals(option._id)) {
		  oldOption.votes -= 1;
		  oldOption.userIDs.pull(userId);
		  await building.save();
		}
	
		if (option.userIDs.find((id) => id.equals(userId))) {
		  return res.status(400).json({ error: "User already voted for this option" });
		}
	
		option.votes += 1;
		option.userIDs.push(userId);
		await building.save();
	
		let voteCount = 0;
		poll.options.forEach((o) => {
		  voteCount += o.userIDs.length;
		});
	
		console.log("Vote Count:"+voteCount)
		poll.voteCount = voteCount // Increment the voteCount by 1
		await poll.save()
	
		console.log("Poll Vote Count:"+poll.voteCount)
		poll.options.forEach((o) => {
		  o.votes = o.userIDs.length;
		  o.percentage = voteCount > 0 ? (o.votes / voteCount) * 100 : 0;
		  o.save();
		});
	console.log("Building POLLS:"+building.polls)
		const updatedBuilding = await Building.findOneAndUpdate(
			{ _id: building._id },
			{ $set: { polls: building.polls } },
			{ new: true }
		  ).populate("polls.options.userIDs");
		console.log("Building Vote Count:"+updatedBuilding.polls[0].voteCount);
	
		return res.json(updatedBuilding);
	  } catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	  }
	
  });




router.post("/poll/:pollId/createOption", async (req, res) => {

	try {
		const {option,userId,buildingId} = req.body;
	  const poll = await Poll.findById(req.params.pollId).populate("options");
	  if (!poll) {
		return res.status(404).json({ message: "Poll not found" });
	  }


  
	  // check if the user creating the option is the creator of the poll
	  if (poll.owner.toString() !== userId) {
		return res.status(403).json({ error: "Only the creator of the poll can add options.Contact  with the poll owner" });
	  }
	  console.log("poll.isExpired:"+poll.isExpired)
	  if(poll.isExpired) return res.status(400).json({error:"Voting period ended for this poll"});
	  console.log("option text:" +option.text)

  // validate the option text
  if (!option || !option.text || option.text.trim().length === 0) {
    return res.status(400).json({ error: "Option text is required" });
  }

  // create a new option with the validated text
  
	 let optionDoc = await Option({
		text: option.text,
		votes: 0,
		userIDs: [],
	  }).save();
  
	  poll.options.push(optionDoc);
  
	  await poll.save();

    // update the Building document with the new option
    await Building.findOneAndUpdate(
		{ buildingId, "polls._id": poll._id },
		{ $push: { "polls.$.options": optionDoc } }
	  );
  
	
  
	  res.status(201).json(option);
	} catch (err) {
	  res.status(500).json({ message: err.message });
	}
  });


// Backend implementation of delete option route
router.delete("/poll/:pollId/deleteOption/:optionId", async (req, res) => {
	try {
	  const poll = await Poll.findById(req.params.pollId);
	  if (!poll) {
		return res.status(404).json({ message: "Poll not found" });
	  }
  
	  const option = poll.options.id(req.params.optionId);
	  if (!option) {
		return res.status(404).json({ message: "Option not found" });
	  }
  
	  const user = await User.findById(req.user.id);
	  if (!user) {
		return res.status(401).json({ message: "User not found" });
	  }
  
	  if (!poll.createdBy.equals(req.user.id)) {
		return res.status(401).json({ message: "You are not authorized to perform this action" });
	  }
  
	  option.remove();
	  await poll.save();
  
	  res.json({ message: "Option deleted" });
	} catch (err) {
	  res.status(500).json({ message: err.message });
	}
  });

  router.put("/poll/:pollId/updateOption/:optionId", async (req, res) => {
	try {
	  const poll = await Poll.findById(req.params.pollId);
	  if (!poll) {
		return res.status(404).json({ message: "Poll not found" });
	  }
  
	  const option = poll.options.id(req.params.optionId);
	  if (!option) {
		return res.status(404).json({ message: "Option not found" });
	  }
  
	  const userId = req.body.userId; // assuming the user ID is sent in the request body
	  if (poll.createdBy.toString() !== userId) {
		return res.status(403).json({ message: "Unauthorized" });
	  }
  
	  option.text = req.body.text;
	  await poll.save();
  
	  res.status(200).json(option);
	} catch (err) {
	  res.status(500).json({ message: err.message });
	}
  });
  
module.exports = router;
