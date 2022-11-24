const crypto = require('crypto');

const genRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
	.toString('hex') /** convert to hexadecimal format */
	.slice(0, length);   /** return required number of characters */
}

module.exports = genRandomString;