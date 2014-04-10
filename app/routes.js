module.exports = function(app, passport) {
	// Home page with login link
	app.get("/", function(req, res) {
		res.render("index.ejs"); // load the index.ejs file
	});

	// Login
	app.get("/login", function(req, res) {
		res.render("login.ejs", {message: req.flash("loginMessage")});
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// Sign-up form
	app.get("/signup", function(req, res) {
		res.render("signup.ejs", {message: req.flash("signupMessage")});
	});
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// Logout
	app.get("/logout", function(req, res) {
		req.logout();
		res.redirect("/");
	});
};

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	res.redirect("/");
}