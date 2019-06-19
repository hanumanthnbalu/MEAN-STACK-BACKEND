const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		// console.log(token);
		jwt.verify(token, 'JWT_SIGNATURE_KEY');
		next();
	} catch (err) {
		res.status(500).send({
			message: 'Not authorized to access!!'
		});
	}
};
