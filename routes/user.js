const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/signup', userController.createUser);
router.post('/login', userController.userLogin);
router.post('/forgotPassword', userController.forgotPassword);

module.exports = router;
