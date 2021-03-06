const express = require('express');
const cors = require('cors');
const router = express.Router();
const is_auth = require('../middlewares/is-auth');
const storeController = require('../controllers/store.controller');

router.use(cors());

router.post('/add-category', storeController.postCategory);

router.post('/add-sub_category', storeController.postSubCategory);

router.post('/add-item', storeController.postItem);

router.post('/change-status', storeController.changeStatus);

router.post('/add-coupon', storeController.postCoupon);

module.exports = router;