var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Raduno', new Schema({
	title: String,
	club: String,
	description: String,
	subscribers: [
		{ type: String }
	]
}));
