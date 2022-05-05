const express = require('express');
const cors = require('cors');
const router = express.Router();
const is_auth = require('../middlewares/is-auth');
const customerController = require('../controllers/customer.controller');

router.use(cors());

router.get('/get-category', customerController.getCategory);

router.post('/add-to-favourites', is_auth, customerController.postFav);

router.get('/get-favourites', is_auth, customerController.getFav);

router.delete('/delete-favourites', is_auth, customerController.deleteFav);

router.get('/get-banner', customerController.getBanner);

router.post('/palce-order', customerController.postOrder);

router.get('/get-order', customerController.getOrder);

module.exports = router;