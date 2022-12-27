# MobileBackend
Nodejs API for android app

LOGIN USER
ENDPOINT:
https://mobile-backend-ak18.vercel.app/loginUser
REQ BODY:
email
password
****************************************************************
REGISTER  RESIDENT USER
ENDPOINT:
https://mobile-backend-ak18.vercel.app/registerUser
REQ BODY:
email
password
name
buildingId
registerUser
***************************************************************

RESIDENT CONTROLLERS
CREATE EVENT
ENDPOINT:
https://mobile-backend-ak18.vercel.app/createEvent
REQ BODY:
buildingId, email,eventTitle, eventDate, eventDescription,functionalArea,condition,serviceContactPhone
******************************************************************************************************
DELETE EVENT
ENDPOINT:
https://mobile-backend-6khq.vercel.app/deleteEvent/:id
*******************************************************
Fetch all events array of a building from DB
ENDPOINT:
https://mobile-backend-ak18.vercel.app/fetchEvents/:buildingId
***************************************************************





