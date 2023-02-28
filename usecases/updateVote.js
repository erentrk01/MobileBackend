
const { Poll } = require("../models/Poll");
async function updateVote(req, res, next) {
	try {
	  const { pollId, optionId } = req.params;
	  const { userId } = req.body;
	  
	  const poll = await Poll.findById(pollId);
	  if (!poll) {
		return res.status(404).json({ error: "Poll not found" });
	  }
	  
	  const option = poll.options.id(optionId);
	  if (!option) {
		return res.status(404).json({ error: "Option not found" });
	  }
	  
	  const userVoted = option.userIDs.includes(userId);
	  if (userVoted) {
		return res.status(400).json({ error: "User already voted for this option" });
	  }
	  
	  const oldOption = poll.options.find(o => o.userIDs.includes(userId));
	  if (oldOption) {
		oldOption.votes -= 1;
		oldOption.userIDs.pull(userId);
	  }
	  
	  option.votes += 1;
	  option.userIDs.push(userId);
	  
	  const updatedPoll = await poll.save();
	  return res.json(updatedPoll);
	} catch (error) {
	  next(error);
	}
  }


module.exports = { updateVote };