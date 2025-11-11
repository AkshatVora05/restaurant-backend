const express = require('express');
const { registerController, loginController, sendOtpController} = require('../controller/authControllers');

const router = express.Router();

router.post('/send-otp', sendOtpController)

router.post('/register', registerController);

router.post('/login', loginController)

module.exports = router;