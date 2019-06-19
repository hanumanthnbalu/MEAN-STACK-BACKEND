const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const SEND_GRID_API_KEY = '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';
const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: SEND_GRID_API_KEY
		}
	})
);

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
			transporter.sendMail({
				to: email,
				from: 'HANUMANTH NBALU<hanumanthnbalu@gmail.com>',
				subject: 'WELCOME TO HNBALU!',
				html: `
						<table width="100%" height="100%" align="center" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4815b"> 
						<tbody> 
						<tr> 
						<td align="center" valign="top"> 
						
						<table align="center" valign="top" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:550px;margin:0 auto" width="100%">
						<tbody><tr> 
						<td> 
						<table align="center" valign="top" border="0" cellpadding="0" cellspacing="0" style="width:92.7%;max-width:510px;margin:0 auto" width="100%"> 
						<tbody> 
						<tr height="20"> 
						<td style="font-size:0px;line-height:0">&nbsp;</td> 
						</tr> 
						<tr height="50"> 
						<td align="left" valign="middle"> 
							<img src="https://lh3.googleusercontent.com/-VTs6GEhLon4/WMA7Fo5sSwI/AAAAAAAAEtY/dAZAoAGwjSMS79ITFsJiG3Mqb5wcmSYewCEwYBhgL/w140-h139-p/IMG_6983.JPG" width="50" height="50" style="border:0;width:51px;height:50px;border-radius: 50px;" class="CToWUd">
						</td> 
						<td align="right" valign="middle"> <span style="text-align:right!important;font-size:12px;color:#ffffff;font-weight:600">HANUMANTHNBALU</span> </td> 
						</tr> 
						</tbody> 
						</table> 
						</td> 
						</tr>
						<tr> 
						<td> 
						<table align="center" valign="top" border="0" cellpadding="0" cellspacing="0" style="width:92.7%;max-width:510px;margin:0 auto" width="100%"> 
						<tbody> 
						<tr height="25"> 
						<td style="font-size:0px;line-height:0">&nbsp;</td> 
						</tr> 
						<tr> 
						<td align="center" valign="top"> 
						<div> 
						</div> </td> 
						</tr> 
						<tr> 
						<td> 
						<table class="m_-4611902048954939277m_7484439867955395762inner-table" summary="inner-table" align="center" valign="top" border="0" cellpadding="0" cellspacing="0" style="width:96%;max-width:490px;margin:0 auto;background-color:#ffffff;background-image:url(https://ci6.googleusercontent.com/proxy/iX49tT0UKKLPmVXIH8NYw_2yjJkLsObn1J4PwRYP5e3eDm5r91DEH_nAZVQZjFRYn6PQhyrFrJujMoEi7aQoJIwb4b05Z-ROZgk6tWCQWTHzAr_NSw=s0-d-e1-ft#http://pages.getpostman.com/rs/067-UMD-991/images/image-shadow.png);background-repeat:repeat-x;background-size:2px 25px;background-position:0px 0px;margin:0 auto;text-align:center" width="100%" bgcolor="#FFFFFF"> 
						<tbody> 
						<tr> 
						<td> 
						<h1 style="font-family:'Open Sans',-apple-system,Helvetica,Arial,sans-serif!important;font-weight:600;margin:25px 20px 25px 20px;padding:0px;text-align:center;color:#282828;font-size:20px">HANUMANTHNBALU</h1> 
						</td> 
						</tr> 
						<tr> 
						<td> 
						<h3 style="text-align: center;">Thank you!.</h3>
						</td> 
						</tr> 
						</tbody> 
						</table> </td> 
						</tr> 						
						</tbody> 
						</table> </td> 
						</tr>
						</tbody>
						</table> 
						
						</td> 
						</tr> 
						<tr> 
						<td> 
						<table  summary="inner-table" align="center" valign="top" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin:0 auto;background-color:#transparent;margin:0 auto;text-align:center" width="100%" bgcolor="#F4815B"> 
						<tbody> 
						<tr height="136"> 
						<td> 
						<div  style="font-family:'Open Sans',-apple-system,Helvetica,Arial,sans-serif!important;font-size:10px;line-height:14px;color:#ffffff!important">
						<p style="font-family:'Open Sans',-apple-system,Helvetica,Arial,sans-serif!important;font-size:10px;line-height:14px;color:#ffffff!important">
						HNBALU</p>
						</div> </td> 
						</tr> 
						</tbody> 
						</table> </td> 
						</tr> 
						</tbody> 
						</table>
				`
			});
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
		const email = req.body.email;
		const password = req.body.password;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(401).send({
				message: 'E-mail not registerd, Please Signup and try!!'
			});
		}
		var matchPwd = await bcrypt.compare(password, user.password);
		if (!matchPwd) {
			return res.status(401).json({
				message: 'Invalid credentials Please try again!!'
			});
		}
		// email: user.email, userId: user._id, username: user.username
		const token = jwt.sign({ user: user }, 'JWT_SIGNATURE_KEY', {
			expiresIn: '1h'
		});
		// console.log(token);
		res.status(200).json({
			message: 'Login Successfull!!',
			user: _.pick(user, [ 'username', 'email' ]),
			token: token
		});
	} catch (err) {
		res.status(500).json({
			message: 'Unable to Login something is not right!!'
		});
	}
};

exports.forgotPassword = async (req, res, next) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(401).send({
				message: 'E-mail not registerd!!'
			});
		}

		// const updatedUser = user.update({ $set: { password: password } });
		// updatedUser.save();
		transporter.sendMail({
			to: email,
			from: 'HANUMANTH NBALU<hanumanthnbalu@gmail.com>',
			subject: 'Forgot Password!',
			html: `<div style="background: #b94c4f;text-align:center;padding:20px;border-radius:10px;width:70%;border:1px solid #cdcdcd;margin:0 auto;color: white;"
		">	<div style="width: 100px;"> <img src="https://s3.amazonaws.com/livedoctor/LiveDoctor_images/1556351429322Z_uwqJ9pb.jpg" alt="Logo"></div>
			<strong style="color:#66cb86">Hi, ${user.username}</strong>
			<h1>You requested to reset your password!</h1>
			<button style="
			padding: 5px 20px;
			font-size: 1rem;
			background: rebeccapurple;
			border: honeydew;
		"><a href="#" style="
		color: white;
		text-decoration: none;
	">Reset</a></button>
			</div>
				  `
		});

		return res.send({
			message: 'E-mail sent please check your inbox!'
		});
	} catch (err) {
		res.status(500).json({
			message: 'Unable set password!!'
		});
	}
};







