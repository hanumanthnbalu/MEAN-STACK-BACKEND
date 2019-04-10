const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
		await bcrypt.hash(password, 10, function(err, hash) {
			const user = new User({
				username: username,
				email: email,
				password: hash
			});
			user.save();
			res.status(201).send({
				message: 'user created successfuly!!',
				user: { username, email }
			});
		});
	} catch (err) {
		res.status(500).json({
			message: 'Unable to create User!!'
		});
	}
};

exports.userLogin = async (req, res, next) => {
	try {
		let fetchedUser;
		const email = req.body.email;
		const password = req.body.password;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(401).send({
				message: 'Email not exists, Please Signup and try!!'
			});
		}
		// fetchedUser = user;
		var matchPwd = await bcrypt.compare(password, user.password);
		if (!matchPwd) {
			return res.status(401).json({
				message: 'Invalid password!!'
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
