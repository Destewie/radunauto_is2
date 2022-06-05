var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({
	email: String,
	username: String,
	password: String,
	display_name: String,
	birth_date: String,
	address: String,
	phone_number: String,
	fiscal_code: String
}));
