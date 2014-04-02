var mongoose = require ( "mongoose" ),
	Schema = mongoose.Schema;

var taskSchema = new Schema ({
    title: {type: String},
    content: {type: String},
    assign_to: {type: String},
    create_by: {type: String},
    create_at: {type: Date},
    edit_at: {type: Date},
    label_type: {type: String, enum:['Lowest', 'Low', 'Normal', 'High', 'Highest']}
});

module.exports = mongoose.model('Task', taskSchema);