var apn = require ("apn");

var tokens = ["73ed3969183c7a740ac40c6d7e89031997382781ad3469578db190c7bb264024", "f735d2181f429f80667eee6eb54ad21298fe6493abd9c9f1adc302337c4bd757", "feec5fa074c1744bce41405b852149fc50e78cb7a22b6bd5b71c4322820f6d12"];

if(tokens[0] == "<insert token here>") {
	console.log("Please set token to a valid device token for the push notification service");
	process.exit();
}

// Create a connection to the service using mostly default parameters.

var options = { "gateway": "gateway.sandbox.push.apple.com", "cert": __dirname + "/certs/cert.pem", "key": __dirname + "/certs/key.pem", "passphrase": "buzzwoo" };
var service = new apn.connection(options);

service.on('connected', function() {
    console.log("Connected");
});

service.on('transmitted', function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString('hex'));
});

service.on('transmissionError', function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
});

service.on('timeout', function () {
    console.log("Connection Timeout");
});

service.on('disconnected', function() {
    console.log("Disconnected from APNS");
});

service.on('socketError', console.error);


// If you plan on sending identical paylods to many devices you can do something like this.
var pushNotificationToMany = function () {
    var note = new apn.notification();
    // note.setAlertText("Hello, from node-apn!");
    // note.badge = 1;
    note.expiry = Math.floor (Date.now () / 1000) + 1200; // Expires in 0.5 hr. from now
    note.badge = 3;
    note.sound = "ping.aiff";
    note.alert = "Hello Notifications";
    note.payload = {"messageFrom" : "BuzzApp"};

    service.pushNotification(note, tokens);
}

// pushNotificationToMany();

var User = require('./models/user.js');
var Task = require('./models/task.js');

// If you have a list of devices for which you want to send a customised notification you can create one and send it to and individual device.
var pushSomeNotifications = function (asignto, text, payload) {

        User.find ({ groupmember : asignto }, function (err, users) {
            if (!err) {
                console.log ( "Prepare to send task to groupmember : " + asignto);
                
                for (var i in users) {
                    var note = new apn.notification();
                    note.expiry = Math.floor (Date.now () / 1000) + 1200; // Expires in 0.5 hr. from now
                    note.badge = 3;
                    note.sound = "ping.aiff";
                    note.alert = text;
                    note.payload = {"messageFrom" : payload};

                    service.pushNotification(note, users[i].devicetoken);
                }

            } else {
                console.log ( "ERROR : " + err );
            }
        });
}

// pushSomeNotifications();

// Export function
exports.pushNotificationToMany = pushNotificationToMany;
exports.pushSomeNotifications = pushSomeNotifications;