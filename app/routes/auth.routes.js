const express = require('express');
const cors = require('cors');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const is_auth = require('../middlewares/is-auth');

router.use(cors());

router.post('/register', authController.Register);

router.post('/login', authController.Login);

router.post('/refresh-token', authController.refreshToken);

router.post('/generate-OTP', authController.generateOTP);

router.post('/verify-OTP', authController.verifyOTP);

router.post('/forgot-password', authController.forgotPassword);

router.post('/change-password', is_auth, authController.changePassword);

router.get('/logout', is_auth, authController.Logout);

module.exports = router;