var express = require ( "express" ),
    app = express (),
    http = require ( "http" ),
    server = http.createServer (app),
    mongoose = require ( "mongoose" ),
    apns = require ( "./apns.js" );

//  Database 
app.configure ( function  () {
    app.use (express.bodyParser ());
    app.use (express.methodOverride ());
    app.use (app.router);
});

app.get ( '/' , function (req, res) { 
    res.send ( "Welcome to BuzzApp Development (Powered by Node.js)" );
});

routes = require('./routes/user')(app);
routes = require('./routes/task')(app);

// Connect to DB
mongoose.connect ( "mongodb://localhost/buzzapp", function (err, res) {
    if (err) {
        console.log ( "ERROR : Connecting to Database" + err );
    } else {
        console.log ( "Connected to Database" );
        // apns.pushNotificationToMany();
    }
});

server.listen ( 3000 , function () { 
    console.log ( "Node server running on http://localhost:3000" );
});