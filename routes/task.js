module.exports = function (app) {

	var Task = require('../models/task.js');

	// GET - Return all users in the db
	findAllTasks = function (req, res) {
		Task.find ( function (err, tasks) {
			if (!err) {
				res.send (tasks);
			} else {	
				console.log ( "ERROR : " + err );
			}
		});
	};

	// GET - Return a user with specified ID
	findTaskById = function (req, res) {
		Task.findById (req.params.id, function (err, task) {
			if (!err) {
				console.log ( "GET /task/" + req.params.id);
				res.send(task);
			} else {
				console.log ( "ERROR : " + err );
			}
		});
	};

	// POST - Insert a new user into db
	createTask = function (req, res) {
		console.log ( "POST" );
		console.log (req.body);

		var task = new Task ({
			title: req.body.title,
    		content: req.body.content,
    		assign_to: req.body.assign_to,
    		create_by: req.body.create_by,
    		create_at: new Date(),
    		edit_at: new Date(),
    		label_type: req.body.label_type,
		});

		task.save ( function (err) {
			if (!err) {
				console.log ( "Created" );
				sendTaskToMember (task.id);
			} else {
				console.log ( "ERROR :" + err );
			}
		});

		res.send (task);
	};

	// PUT - Update to register already exists
	updateTask = function (req, res) {
		Task.findById (req.params.id,  function (err, task) {
			task.title = req.body.title,
    		task.content = req.body.content,
    		task.assign_to = req.body.assign_to,
    		task.create_by = req.body.create_by,
    		task.edit_at = new Date(),
    		task.label_type = req.body.label_type

			task.save ( function (err) {
				if (!err) {
					console.log ( "Updated" );
				} else {
					console.log ( "ERROR :" + err );
				}
			});

			res.send(task);
		});
	};

	// DELETE - Delete a specified ID 
	deleteTask = function (req, res) {
  		Task.findById (req.params.id, function (err, task) {
  			task.remove( function (err) {
  				if (!err) {
  					console.log( "Removed" );
  				} else {	
  					console.log( "ERROR :" + err );
 				}
  			});
  		});
  	};

  	//Link routes and functions
  	app.get('/tasks', findAllTasks);
  	app.get('/task/:id', findTaskById);
  	app.post('/task', createTask);
  	app.put('/task/:id', updateTask);
  	app.delete('/task/:id', deleteTask);
}


var apns = require ( "../apns.js" );
var Task = require('../models/task.js');

var sendTaskToMember = function (id) {
	Task.findById (id,  function (err, task) {
		apns.pushSomeNotifications(task.assign_to, task.title, task.content);
	});
}