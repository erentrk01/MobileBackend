const sha512 = require("./sha512");

checkHashPassword = (password, salt) => {
	const passwordData = sha512(password, salt);
	return passwordData;
}

module.exports = checkHashPassword;