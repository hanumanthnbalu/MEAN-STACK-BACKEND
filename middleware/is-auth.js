const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		// console.log(token);
		const decoded = jwt.verify(token, 'JWT_SIGNATURE_KEY');
		// console.log(decoded.user);
		req.user = {email: decoded.user.email, userId: decoded.user._id};
		next();
	} catch (err) {
		res.status(500).send({
			message: 'Not authorized to access!!'
		});
	}
};
