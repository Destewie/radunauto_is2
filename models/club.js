var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Club', new Schema({
	name: String,
	description: String,
	owner: String,
	subscribers: [
		{ type: String }
	],
	bans: [
		{ type: String }
	]
}));
