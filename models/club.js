var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Club', new Schema({
	name: String,
	owner: String,
}));
