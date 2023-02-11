const jwt = require("jsonwebtoken");

	module.exports= {
		genRefreshToken : (user) => {
			const secretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
			const token = jwt.sign(
				{
					_id: user._id,
					name: user.name,
					email: user.email,
					verifyStatus: user.verified,
					buildingId:user.buildingId,
					isManager:user.isManager,
			
				},
				secretKey,
				{
					expiresIn: "30m",
				}
				);
			
			  return token;
		
		},

		genAccessToken : (user) => {
			const secretKey = process.env.JWT_SECRET;
		  
			const token = jwt.sign(
			  {
				  _id: user._id,
				  name: user.name,
				  email: user.email,
				  verifyStatus: user.verified,
				  buildingId:user.buildingId,
				  isManager:user.isManager,
		  
			  },
			  secretKey,
			  {
				expiresIn: "1h",
			  }
			  );
		  
			return token;
		  },
		verifyAccessToken: (token) => jwt.verify(token, process.env.JWT_SECRET),
		verifyRefreshToken: (token) => jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY),

	}

 