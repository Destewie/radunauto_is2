var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Club_post', new Schema({
	club: String,
	author: String,
	title: String,
	description: String,
	img: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}));
