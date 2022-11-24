const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();


// Import Routes




//



const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;


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
