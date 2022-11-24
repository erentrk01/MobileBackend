const crypto = require('crypto');
const sha512 = (password,salt)=>{
	const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
	hash.update(password);
	const value = hash.digest('hex');
	return{
		salt:salt,
		passwordHash:value
	};
}

module.exports = sha512;