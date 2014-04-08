module.exports = function (app) {
	var bCrypt = require("bcrypt-nodejs");
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

	// GET - Return a user with specified GroupMember
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

	// GET - Return a user with specified ID
	loginUser = function (req, res) {
		User.find ({ email : req.body.email }, function (err, user) {
			if (!err) {
				console.log ( "Login with email :" + req.body.email);
				console.log ( "user :" + user);

				bCrypt.hash(req.body.password, 10, function(err, hash) {
  					console.log ( "REQUEST PASSWORD :" + hash );
				});		

				bCrypt.compare(req.body.password, user.password, function(err, res) {
    				if (res) {
  						console.log ( "LOGIN SUCCEEDED" );
  						// res.send({message : "LOGIN SUCCEEDED"});
					} else {
						console.log ( "LOGIN FAILE" );
						// res.send({message : "LOGIN FAILE"});
					}
				});	
			} else {
				console.log ( "ERROR : " + err );
				// res.send({message : "DELETE SUCCEEDED"});
			}
		});
	};

	// POST - Insert a new user into db
	createUser = function (req, res) {
		console.log ( "POST" );
		console.log (req.body);

		bCrypt.hash(req.body.password, 10, function(err, hash) {
  			// Store hash in your password DB.
  			console.log ( "pass : " + hash ); 

  			var user = new User ({
				firstname: req.body.firstname,
    			lastname: req.body.lastname,
    			email: req.body.email,
    			password: hash,
    			groupmember: req.body.groupmember,
    			create_at: new Date(),
    			edit_at: new Date(),
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
		});
	};

	// PUT - Update to register already exists
	updateUser = function (req, res) {
		User.findById (req.params.id,  function (err, user) {
			user.firstname = req.body.firstname,
    		user.lastname = req.body.lastname,
    		user.email = req.body.email,
    		user.groupmember = req.body.groupmember,
    		user.edit_at = new Date(),
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
  					console.log( "DELETE SUCCEEDED" );
  					res.send({message : "DELETE SUCCEEDED"});
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
  	app.post('/login', loginUser);
  	app.post('/user', createUser);
  	app.put('/user/:id', updateUser);
  	app.delete('/user/:id', deleteUser);
}