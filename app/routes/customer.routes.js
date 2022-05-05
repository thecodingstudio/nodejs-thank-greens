const express = require('express');
const cors = require('cors');
const router = express.Router();
const is_auth = require('../middlewares/is-auth');
const customerController = require('../controllers/customer.controller');

router.use(cors());

router.get('/get-category', customerController.getCategory);


module.exports = router;