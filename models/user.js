var mongoose = require ( "mongoose" );
var bcrypt = require("bcrypt-nodejs");

var userSchema = new  mongoose.Schema ({
    firstname: {type: String},
    lastname: {type: String},
    email: {type: String},
    password: {type: String},
    groupmember: {type: String},
    create_at: {type: Date},
    edit_at: {type: Date},
    devicetoken: {type: String},
    job_title: {type: String, enum:['Sale', 'Sale Supervisor', 'Sale Manager', 'Sale Director', 'President', 'Administrator', 'Manger Director', 'Mobile Developer', 'Web Developer', 'CEO', 'CTO']}
});

// Generata hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check password valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', userSchema);