const saltHashPassword = (userPassword) => {
	const salt = genRandomString(16); // Gives us salt of length 16
	const passwordData = sha512(userPassword, salt);
	return passwordData;
}

module.exports = saltHashPassword;