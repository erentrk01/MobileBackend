const multer = require('multer');
const fs = require('fs');

// configure storage for uploaded files
const Storage = multer.diskStorage({
	destination: function(req, file, cb) {
	  const userId = req.user._id; // get the user ID from the authenticated user
	  const folder = `./uploads/${userId}`; // create a folder for each user to store their uploads
	  fs.mkdirSync(folder, { recursive: true }); // create the folder (if it doesn't already exist)
	  cb(null, folder); // specify the folder where the uploaded files will be stored
	},
	filename: function(req, file, cb) {
	  const extension = path.extname(file.originalname);
	  const name = path.basename(file.originalname, extension);
	  cb(null, `${name}-${Date.now()}${extension}`); // generate a unique filename for each uploaded file
	},
  });

exports.Storage = Storage;