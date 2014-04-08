var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var configDB = require("./config/database.js");

mongoose.connect(configDB.url);

require("./config/passport")(passport);

// configuration ===============================================================
app.configure(function() {
	// Setup Express application
	app.use(express.logger("dev")); // log every request to the console.
	app.use(express.cookieParser()); // 
	app.use(express.bodyParser()); // get information from html forms
	app.set("view engine", "ejs"); // set up ejs for templating

	// Require passport
	app.use(express.session({secret: "buzzappbuzzappbuzzapp"})); // session
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
});

// routes ======================================================================
require("./app/routes.js")(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log("The magic happens on port " + port);