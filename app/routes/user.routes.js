const express = require('express');
const cors = require('cors');
const router = express.Router();
const is_auth = require('../middlewares/is-auth');
const userController = require('../controllers/user.controller');

router.use(cors());

router.get('/get-profile', is_auth, userController.getProfile);

router.post('/update-profile', is_auth, userController.updateProfile);

router.post('/add-address', is_auth, userController.postAddress);

router.post('/update-address/:id', is_auth, userController.updateAddress);

router.delete('/delete-address/:id', is_auth, userController.deleteAddress);

router.get('/get-address', is_auth, userController.getAddress);

module.exports = router;