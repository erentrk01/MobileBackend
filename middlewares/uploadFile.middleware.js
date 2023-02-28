// configure the Multer middleware
const {Storage} = require("../utils/storage")

const upload = multer({
	storage: Storage,
	limits: { fileSize: 1000000 }, // specify the file size limit (in bytes)
	fileFilter: function(req, file, cb) {
	  if (file.mimetype !== 'application/pdf' &&
		  file.mimetype !== 'image/jpeg' &&
		  file.mimetype !== 'image/png' &&
		  file.mimetype !== 'application/msword' &&
		  file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
		return cb(new Error('Only PDFs, JPEGs, PNGs, and DOC files are allowed'));
	  }
	  cb(null, true);
	},
  }).array('files', 5); // specify the field name and maximum number of files
  
exports.upload = upload;