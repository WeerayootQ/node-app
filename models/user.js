var mongoose = require ( "mongoose" ),
	Schema = mongoose.Schema;

var userSchema = new Schema ({
    firstname: {type: String},
    lastname: {type: String},
    email: {type: String},
    groupmember: {type: String},
    create_at: {type: Date},
    edit_at: {type: Date},
    devicetoken: {type: String},
    job_title: {type: String, enum:['Sale', 'Sale Supervisor', 'Sale Manager', 'Sale Director', 'President', 'Administrator', 'Manger Director']}
});

module.exports = mongoose.model('User', userSchema);