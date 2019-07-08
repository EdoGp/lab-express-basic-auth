const mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		email: {
			type: String,
			// required: true,
			unique: true,
			// index: true,
		},
		password: {
			type: String,
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('User', userSchema);
