module.exports = function (app) {

	var User = require('../models/user.js');

	// GET - Return all users in the db
	findAllUsers = function (req, res) {
		User.find ( function (err, users) {
			if (!err) {
				res.send (users);
			} else {	
				console.log ( "ERROR : " + err );
			}
		});
	};

	// GET - Return a user with specified ID
	findUserById = function (req, res) {
		User.findById (req.params.id, function (err, user) {
			if (!err) {
				console.log ( "GET /user/" + req.params.id);
				res.send(user);
			} else {
				console.log ( "ERROR : " + err );
			}
		});
	};

	// GET - Return a user with specified ID
	findUserByGroup = function (req, res) {
		User.find ({ groupmember : req.params.groupmember }, function (err, users) {
			if (!err) {
				console.log ( "GET /user/" + req.params.groupmember);
				res.send(users);
			} else {
				console.log ( "ERROR : " + err );
			}
		});
	};

	// POST - Insert a new user into db
	createUser = function (req, res) {
		console.log ( "POST" );
		console.log (req.body);

		var user = new User ({
			firstname: req.body.firstname,
    		lastname: req.body.lastname,
    		email: req.body.email,
    		groupmember: req.body.groupmember,
    		create_at: req.body.create_at,
    		edit_at: req.body.edit_at,
    		devicetoken: req.body.devicetoken,
    		job_title: req.body.job_title
		});

		user.save ( function (err) {
			if (!err) {
				console.log ( "Created" );
			} else {
				console.log ( "ERROR :" + err );
			}
		});

		res.send (user);
	};

	// PUT - Update to register already exists
	updateUser = function (req, res) {
		User.findById (req.params.id,  function (err, user) {
			user.firstname = req.body.firstname,
    		user.lastname = req.body.lastname,
    		user.email = req.body.email,
    		user.groupmember = req.body.groupmember,
    		user.create_at = req.body.create_at,
    		user.edit_at = req.body.edit_at,
    		user.devicetoken = req.body.devicetoken,
    		user.job_title = req.body.job_title

			user.save ( function (err) {
				if (!err) {
					console.log ( "Updated" );
				} else {
					console.log ( "ERROR :" + err );
				}
			});

			res.send(user);
		});
	};

	// DELETE - Delete a specified ID 
	deleteUser = function (req, res) {
  	User.findById (req.params.id, function (err, user) {
  		user.remove( function (err) {
  				if (!err) {
  					console.log( "Removed" );
  				} else {	
  					console.log( "ERROR :" + err );
 				}
  			});
  		});
  	};

  	//Link routes and functions
  	app.get('/users', findAllUsers);
  	app.get('/user/:id', findUserById);
  	app.get('/usergroup/:groupmember', findUserByGroup);
  	app.post('/user', createUser);
  	app.put('/user/:id', updateUser);
  	app.delete('/user/:id', deleteUser);
}