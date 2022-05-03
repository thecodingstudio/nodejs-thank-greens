const express = require('express');
const cors = require('cors');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.use(cors());

router.post('/register', authController.Register);

router.post('/login', authController.Login);

router.post('/refresh-token', authController.refreshToken);

router.post('/forgot-password', authController.forgotPassword);

// router.post('/change-password', authController.changePassword);

module.exports = router;