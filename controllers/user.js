const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

function hashingPassword(password) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash) => {
			password = hash;
		});
	});
}

exports.createUser = async (req, res, next) => {
	try {
		const username = req.body.username;
		const email = req.body.email;
		const password = req.body.password;
		const emailExist = await User.findOne({ email: email });
		if (emailExist) {
			return res.status(200).send({
				message: 'User already exist!'
			});
		}
		const user = new User({
			username: username,
			email: email,
			password: password
		});
		user.save();
		res.status(201).send({
			message: 'user created successfuly!!',
			user: user
		});
	} catch (err) {
		res.status(500).json({
			message: 'Unable to create User!!'
		});
	}
};

exports.userLogin = async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;
		const user = await User.findOne({ email: email, password: password });
		if (!user) {
			return res.status(401).send({
				message: 'Invalid credentials!!'
			});
		}
		const token = jwt.sign({ email: email, userId: user._id, username: user.username }, 'SECRET_JWT_KEY', {
			expiresIn: '1h'
		});
		res.status(200).send({
			message: 'user found!!',
			token: token,
			user: user
		});
	} catch (err) {
		res.status(500).json({
			message: 'Unable to Login something is not right!!'
		});
	}
};
