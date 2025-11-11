const express = require('express');
const { testUserController } = require('../controller/testControllers');

const router = express.Router();

router.get('/test-user', testUserController)

module.exports = router;