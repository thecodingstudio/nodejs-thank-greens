require('dotenv').config();
const User = require('../models/user');
const Order = require('../models/order');
const Card = require('../models/card');
const Payment = require('../models/payment');

const stripe = require('stripe')(process.env.STRIPE_SK);

/*
 * Create card for loggedIn user.
*/
exports.addCard = async (req, res, next) => {
    try {

        // Find user.
        const user = await User.findByPk(req.user_id);

        // Create card.
        const card = await stripe.customers.createSource(
            user.stripe_id,
            {
                source: {
                    'object': 'card',
                    'number': req.body.number,
                    'exp_month': req.body.exp_month,
                    'exp_year': req.body.exp_year,
                    'cvc': req.body.cvc
                }
            }
        );

        // Save card id in database.
        const result = await Card.create({ card_id: card.id, userId: req.user_id });

        return res.status(200).json({ message: 'Card saved successfully.', data: result, status: 1 });

    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ ErrorMessage: err.message || 'Something went wrong!', status: 0 });
    }
}

/*
 * Get saved card for loggedIn user.
*/
exports.getCard = async (req, res, next) => {
    try {

        // Find user.
        const user = await User.findByPk(req.user_id);

        //Find saved card of user.
        try {
            const cards = await stripe.customers.listSources(
                user.stripe_id,
                { object: 'card' }
            );

            if (cards.data.length === 0) {
                return res.status(404).send({ message: 'No card found with logged-in user!', status: 1 });
            }

            // Sending response.
            return res.status(200).json({ message: 'Card fetched successfully.', cards: cards, status: 1 });

        } catch (err) {
            console.log(err);
            return res.status(500).send({ ErrorMessage: err.message || 'Something went wrong!', status: 0 });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ ErrorMessage: err.message || 'Something went wrong!', status: 0 });
    }
}

exports.checkout = async (req, res, next) => {
    const order = await Order.findOne({ where: { userId: req.user_id, id: req.body.orderId } });
    if (!order) {
        return res.status(404).json({ ErrorMessage: 'Order not found!', status: 0 });
    }
    try {
        const user = await User.findByPk(req.user_id);

        // Cheack whether user exists in stripe or not. 
        if (!user.stripe_id) {
            return res.status(404).json({ ErrorMessage: 'Stipe account not found!' });
        }

        // Retrive saved card data using card_id.
        const cards = await stripe.customers.retrieveSource(
            user.stripe_id,
            req.body.card_id
        );

        // Create payment intent for user.
        const payment_intent = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            description: 'Pay to Bluff city',
            receipt_email: user.email_id,
            amount: parseFloat(parseInt(order.total_amount * 1000)) / 10,
            currency: 'usd',
            customer: user.stripe_id,
            payment_method: cards.id
        });

        // Payment_payload for ONLINE order.
        const payment_payload = {
            transaction_id: payment_intent.client_secret,
            amount: order.total_amount,
            userId: req.user_id,
            storeId: order.storeID,
            status: 'PENDING',
            orderId: order.id
        }

        // Create payment for Online order.
        const payment = await Payment.create(payment_payload);

        return res.status(200).json({ message: 'Payment intent created successfully.', payment: payment, status: 1 })

    }
    catch (error) {
        console.log(error);
        return res.status(404).json({ ErrorMessage: 'Payment createtion failed due to craeting payment_intent' });
    }
}