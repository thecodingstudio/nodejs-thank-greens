const express = require('express');
const cors = require('cors');
const router = express.Router();
const is_auth = require('../middlewares/is-auth');
const customerController = require('../controllers/customer.controller');
const paymentController = require('../controllers/payment.controller');

router.use(cors());

router.get('/get-homepage', customerController.getCategory);

router.get('/get-banner', customerController.getBanner);

router.get('/get-rec', customerController.getRec);

router.post('/add-to-favourites', is_auth, customerController.postFav);

router.get('/get-favourites', is_auth, customerController.getFav);

router.delete('/delete-favourites', is_auth, customerController.deleteFav);

router.post('/place-order', is_auth, customerController.postOrder);

router.get('/get-order', is_auth, customerController.getOrder);

router.get('/get-order-status', is_auth, customerController.getOrderStatus);

router.post('/cancel-order', is_auth, customerController.cancelOrder);

router.post('/add-card', is_auth, paymentController.addCard);

router.get('/get-card', is_auth, paymentController.getCard);

router.post('/checkout', is_auth, paymentController.checkout);

router.get('/get-coupons', is_auth, customerController.getCoupons);

module.exports = router;