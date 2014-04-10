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

	//=================================
	// SIGN UP SECTION
	//=================================
	// GET - Render SignUp screen.
	signUp = function(req, res) {
		res.render("signup.ejs", {message: req.flash("signupMessage")});
	};
	// POST - Insert a new user into db
	signUpUser = function (req, res) {
		console.log ( "POST" );
		console.log (req.body);

		User.findOne({ email : req.body.email}, function(err, user) {
			if (err) {
				console.log ( "ERROR :" + err );
			}

			if (user) {
				console.log ( "Found!!! : Already have this user in DB");
			} else {
				var newUser = new User ();
				newUser.firstname = req.body.firstname;
				newUser.lastname = req.body.lastname,
    			newUser.email = req.body.email,
    			newUser.password = newUser.generateHash(req.body.password),
    			newUser.groupmember = req.body.groupmember,
    			newUser.create_at = new Date(),
    			newUser.edit_at = new Date(),
    			newUser.devicetoken = req.body.devicetoken,
    			newUser.job_title = req.body.job_title

				newUser.save ( function (err) {
					if (!err) {
						console.log ( "Created" );
						res.send (newUser);	
						res.redirect("/profile/" + req.body.email);
					} else {
						console.log ( "ERROR :" + err );
					}
				});
			}
		});
	};

	//=================================
	// UPDATE SECTION
	//=================================
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

	//=================================
	// DELETE SECTION
	//=================================
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

  	home = function(req, res) {
		res.render("index.ejs"); // load the index.ejs file
	};

	//=================================
	// PROFILE SECTION
	//=================================
	profile = function(req, res) {
		User.findOne({ email : req.params.email}, function(err, newUser) {
			if (err) {
				console.log ( "ERROR :" + req.body );
			}

			if (newUser) {
				console.log('profile :' + newUser);
				res.render('profile.ejs', {
					user : newUser // get the user out of session and pass to template
				});
			} else {
				console.log ( "SOMETHING WRONG" );
			}
		});
	};

	//=================================
	// PROFILE SECTION
	//=================================
	signOut = function(req, res) {
		req.logout();
		res.redirect("/");
	}


  	//Link routes and functions
  	app.get('/', home);
  	app.get('/profile/:email', profile);
  	app.get('/signup', signUp);
  	app.get('/signout', signOut);
  	app.get('/users', findAllUsers);
  	app.get('/users/:id', findUserById);
  	app.get('/usergroup/:groupmember', findUserByGroup);
  	app.post('/login', loginUser);
  	app.post('/users', signUpUser);
  	app.put('/users/:id', updateUser);
  	app.delete('/users/:id', deleteUser);
}