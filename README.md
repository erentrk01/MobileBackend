# MobileBackend
Nodejs API for android app

LOGIN USER
ENDPOINT:
https://mobile-backend-s6ep.vercel.app/loginUser
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
https://mobile-backend-ak18.vercel.app/deleteEvent/:id
*******************************************************
Fetch all events array of a building from DB
ENDPOINT:
https://mobile-backend-ak18.vercel.app/fetchEvents/:buildingId
***************************************************************


Actors:
Residents
Managers (for each building)
Workers
Use Cases:

Create Building Account (Manager)
Create Resident Account (Residents)
Authenticate (Residents, Manager)
Create Event (Residents, Manager, Workers)
Associations:

Manager can create Building Account, It is also a resident account
Residents can create Resident Account
Resident Account need to be authenticated with Building ID and password at the registration.
Users and Manager can create events
Note: This is a high-level representation of the use case diagram, and there may be additional use cases or details that would need to be included for a more complete picture.










