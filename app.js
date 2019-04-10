const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const userRoutes = require('./routes/user');

// CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
	  "Access-Control-Allow-Headers",
	  "Origin, X-Requested-With, Content-Type, Accept, Authorization "
	);
	res.setHeader(
	  "Access-Control-Allow-Methods",
	  "GET, PUT, POST,DELETE, OPTIONS, PATCH"
	);
	next();
  });

app.use('/api/users', userRoutes);

mongoose.Promise = global.Promise;
mongoose
	.connect('mongodb://localhost:27017/USER_REG', { useNewUrlParser: true })
	.then(() => {
		console.log('connected to DB!!');
	})
	.catch(() => {
		console.log('Error to connect DB!');
	});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`server connected on ${port}`);
});
// module.exports = app;
