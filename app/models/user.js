var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
    	firstname    : String,
    	lastname	 : String,
        email        : String,
        password     : String,
        groupmember: String,
        createAt: Date,
    	editAt: Date,
  		deviceToken: String,
  		jobTitle: String
    }
});

// Generata hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check password valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to app
module.exports = mongoose.model("User", userSchema);