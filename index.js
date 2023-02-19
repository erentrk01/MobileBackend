const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();


// Import Routes
const authBuildingRoute = require("./routes/BuildingAccount.AuthOps.Route");
const authUserRoute = require("./routes/UserAccount.AuthOps.Route");
const signInUserRoute = require("./routes/Signin.AuthOps.Route");
const residentControllerRoute = require("./routes/Controllers/resident.controller");
const commentControllerRoute = require("./routes/Controllers/comment.controller");
const likeControllerRoute = require("./routes/Controllers/like.controller");
//



const app = express();

app.use(express.static("public"));
app.use(cors());
//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use("/registerBuild", authBuildingRoute);
app.use( authUserRoute);
app.use(residentControllerRoute);
app.use(commentControllerRoute);
app.use(likeControllerRoute);
app.use(signInUserRoute);

app.get("/", (req, res) => {
	res.send("APP IS RUNNING");
  });

//! DB Connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
  });
  
  mongoose.connection.on("connected", () => {
	console.log("MongoDB connected");
  });
  
  mongoose.connection.on("error", (err) => {
	console.error("Error connecting to mongo", err);
  });
  

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
  });
