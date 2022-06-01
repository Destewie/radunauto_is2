var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Car', new Schema({
	name: String,
  owner: String,
  manufacturer: String,
	model: String,
  year: String
}));