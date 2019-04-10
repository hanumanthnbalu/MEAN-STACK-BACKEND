const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	}
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
