const { Building } = require('../models/Building');
const { Poll } = require('../models/Poll');
const moment = require('moment');
module.exports = {
	updatePollsRemainingTime: async () => {
	  const buildings = await Building.find().populate('polls'); // Find all buildings and populate their polls
  
	  if (!buildings) return; // If there are no buildings, return
	  console.log("update started")
  
	  for (const building of buildings) {
		for (let i = 0; i < building.polls.length; i++) {
		  const poll = building.polls[i];
		  if (!poll.isExpired) { // If the poll hasn't expired yet
			const expiresAt = moment(poll.createdAt)
  .add(poll.duration.days, 'days')
  .add(poll.duration.hours, 'hours')
  .add(poll.duration.minutes, 'minutes')
  
			const remainingTime = moment.duration(expiresAt.diff(moment())); // Calculate remaining time using Moment.js
			
  
			const remainingDays = Math.floor(remainingTime.asDays());
			const remainingHours = remainingTime.hours();
			const remainingMinutes = remainingTime.minutes();
  
			let formattedRemainingTime = '';
			if (remainingDays > 0) {
			  formattedRemainingTime += `${remainingDays} days`;
			}
			else if (remainingHours > 0) {
			  formattedRemainingTime += `${remainingHours} hours`;
			}
			else if(remainingMinutes > 0) formattedRemainingTime += `${remainingMinutes} minutes`;
			
			else if(remainingMinutes === 0 && remainingHours === 0 && remainingDays === 0) {
				building.polls[i].isExpired = true;
			}
  
			building.polls[i].remainingTime = formattedRemainingTime; // Update poll with new remaining time within the building object
		  } else {

			
			const expiresAt = moment(poll.createdAt)
			let formattedPassingTime ;
			const passingTime = moment.duration(expiresAt.diff(moment()));
			const passingDays  = -1 * Math.floor(passingTime.asDays()) -1;
			const passingHours = -1 * passingTime.hours() -1;
			const passingMinutes = -1 * passingTime.minutes();
			if( passingDays >1)
			formattedPassingTime = `${passingDays} day`;
			else if(passingDays === 1)
			formattedPassingTime  = `${passingDays} day`;
			else
			{ if( passingHours !== 0)
				formattedPassingTime = `${passingHours} hours, ${passingMinutes} minutes`;
			else
			formattedPassingTime  = `${passingMinutes} minutes`;
			}; // Set remaining time to null if the poll has expired

			
			building.polls[i].remainingTime = formattedPassingTime
			
		  }
		}
  
		await building.save(); // Save the updated building object
	  }
	}
  }