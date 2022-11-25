const genRandomString =require("./genRandomString");
const sha512 = require("./sha512");

const saltHashPassword = (userPassword) => {
	const salt = genRandomString(16); // Gives us salt of length 16
	
	console.log(userPassword);
	const passwordData = sha512(userPassword, salt);
	return passwordData;
}

module.exports = saltHashPassword;