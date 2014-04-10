var express = require ( "express" ),
    app = express (),
    http = require ( "http" ),
    server = http.createServer (app),
    mongoose = require ( "mongoose" ),
    apns = require ( "./apns.js" ),
    flash = require("connect-flash"),
    passport = require("passport"),
    configDB = require("./config/database.js");

mongoose.connect(configDB.url);

require("./config/passport")(passport);

//  Database 
app.configure ( function  () {
    app.use (express.logger("dev"));
    app.use (express.bodyParser ());
    app.use (express.methodOverride ());
    app.use (express.cookieParser()); // 
    app.set ("view engine", "ejs"); // set up ejs for templating

    // Require passport
    app.use (express.session({secret: "buzzappbuzzappbuzzapp"})); // session
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session
    app.use (app.router);
});

routes = require('./routes/user')(app, passport);
routes = require('./routes/task')(app);

// // Connect to DB
// mongoose.connect ( "mongodb://localhost/buzzapp", function (err, res) {
//     if (err) {
//         console.log ( "ERROR : Connecting to Database" + err );
//     } else {
//         console.log ( "Connected to Database" );
//         // apns.pushNotificationToMany();
//     }
// });

server.listen ( 3000 , function () { 
    console.log ( "Node server running on http://localhost:3000" );
});