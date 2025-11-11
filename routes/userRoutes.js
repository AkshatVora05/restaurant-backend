const express = require('express');
const { getUserController, updateUserController, resetPasswordController, updatePasswordController, deleteUserController, resetPasswordOtpController } = require('../controller/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/getUser', getUserController);

router.put('/updateUser', authMiddleware, updateUserController);

router.post('/resetPasswordOTP', authMiddleware, resetPasswordOtpController);

router.post('/resetPassword', authMiddleware, resetPasswordController);

router.post('/updatePassword', authMiddleware, updatePasswordController);

router.delete('/deleteUser/:id', authMiddleware, deleteUserController);

module.exports = router;