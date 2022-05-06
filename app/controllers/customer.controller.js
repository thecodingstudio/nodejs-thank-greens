const User = require('../models/user');
const Category = require('../models/category');
const Sub_category = require('../models/sub_category');
const Item = require('../models/item');
const Item_image = require('../models/item_image');
const Item_size = require('../models/item_size');
const Favourites = require('../models/favourite');
const Banner = require('../models/banner');
const Order = require('../models/order');
const Order_item = require('../models/order_item');

const { Op, or } = require("sequelize");

exports.getCategory = async (req, res, next) => {

    try {

        const category = await Category.findAll({
            attributes: ['id', 'title', 'image'],
            include: {
                model: Sub_category,
                attributes: ['id', 'title', 'image', 'categoryId'],
                include: {
                    model: Item,
                    attributes: ['id', 'name', 'discreption', 'subCategoryId'],
                    include: [{
                        model: Item_image,
                        attributes: ['id', 'image', 'itemId']
                    }, {
                        model: Item_size,
                        attributes: ['id', 'size', 'price', 'itemId']
                    }]
                }
            }
        });

        return res.status(200).json({
            message: "Category, Sub_Category and it's all Item fetched successfully",
            data: category,
            status: 1
        });
    }
    catch (err) {
        console.log(err);
        const error = new Error('Failed to fetch details, Please meet your backend devloper!');
        error.statusCode = 400;
        throw (error);
    }

}


exports.postFav = async (req, res, next) => {
    const userId = req.user_id;
    const itemId = req.body.itemId;

    try {

        const is_favourite = await Favourites.findOne({ where: { userId: userId, itemId: itemId } });
        if (is_favourite) {
            return res.status(400).json({ ErrorMessage: 'Item already in favourites list!', status: 0 });
        }

        const favourite = await Favourites.create({ userId: userId, itemId: itemId });
        return res.status(200).json({ message: "Added to Favourites!", data: favourite, status: 1 });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ ErrorMessage: err || 'Something went wrong!', status: 0 });
    }
}

exports.getFav = async (req, res, next) => {
    const userId = req.user_id;

    try {

        const favs = await Favourites.findAll({ where: { userId: userId } });
        if (favs.length === 0) {
            return res.status(200).json({ message: "No Favourites Found!", status: 1 })
        }
        let list = [];
        for (let i = 0; i < favs.length; i++) {
            const item = await Item.findOne({ where: { id: favs[i].itemId }, attributes: ['id', 'name', 'discreption'] });
            list.push(item);
        }
        return res.status(200).json({ message: "Favourites Items Found!", data: list, status: 1 })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ ErrorMessage: err || 'Something went wrong!', status: 0 });
    }
}

exports.deleteFav = async (req, res, next) => {
    const userId = req.user_id;
    const itemId = req.body.itemId;

    try {

        await Favourites.destroy({ where: { itemId: itemId, userId: userId } })
        return res.status(200).json({ message: "Removed Item From Favourites!", status: 1 });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ ErrorMessage: err || 'Something went wrong!', status: 0 });
    }
}

exports.getBanner = (req, res, next) => {
    Banner.findAll({ attributes: ['image'] })
        .then(banner => {
            return res.status(200).json({ message: 'Benner fetched successfully', banner: banner, status: 1 });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ ErrorMessage: err || 'Something went wrong!', status: 0 });
        })
}

exports.postOrder = async (req, res, next) => {

    const body = req.body;

    const payload_order = {
        delivery_date: body.delivery_date,
        delivery_time: body.delivery_time,
        payment_method: body.payment_method,
        sub_total: body.sub_total,
        delivery_charge: body.delivery_charge,
        total_amount: Math.round((parseFloat(body.sub_total) + body.delivery_charge) * 100) / 100,
        status: 'Ordered',
        userId: req.user_id
    }

    try {
        const order = await Order.create(payload_order);

        let payload_item = body.order_item;
        for (let i = 0; i < payload_item.length; i++) {
            payload_item[i].orderId = order.id;
        }

        try {
            const order_item = await Order_item.bulkCreate(payload_item);
            return res.status(200).json({
                message: 'Order created successfully.',
                order: {
                    id: order.id,
                    total_amount: order.total_amount,
                    status: order.status
                }, status: 1
            });
        } catch (error) {
            console.log(error);
            order.destroy();
            return res.status(400).json({ ErrorMessage: 'Failed to create order item', status: 0 });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ ErrorMessage: 'Failed to create order', status: 0 });
    }
}

exports.getOrder = async (req, res, next) => {

    let order, count;
    try {
        const currentPage = req.query.page || 1;
        const perPage = 2

        if (req.query.status === 'past') {
            order = await Order.findAll({
                offset: (currentPage - 1) * perPage,
                limit: perPage,
                where: { userId: req.user_id, status: { [Op.or]: ['Delivered', 'Cancelled'] } },
                attributes: ["id", "delivery_date", "delivery_time", "payment_method", "sub_total", "delivery_charge", "total_amount", "status", "cancellation_reason"],
                include: {
                    model: Order_item,
                    attributes: ["id", "quantity"],
                    include: [{
                        model: Sub_category,
                        attributes: ["title", "image"]
                    }, {
                        model: Item,
                        attributes: ["name"]
                    }, {
                        model: Item_size,
                        attributes: ["size", "price"]
                    }]
                }
            });
            count = await Order.findAll({ where: { userId: req.user_id, status: { [Op.or]: ['Delivered', 'Cancelled'] } } });
        }
        else if (req.query.status === 'current') {
            order = await Order.findAll({
                offset: (currentPage - 1) * perPage,
                limit: perPage,
                where: { userId: req.user_id, status: { [Op.or]: ['Ordered', 'Packed', 'Shipped'] } },
                attributes: ["id", "delivery_date", "delivery_time", "payment_method", "sub_total", "delivery_charge", "total_amount", "status"],
                include: {
                    model: Order_item,
                    attributes: ["id", "quantity"],
                    include: [{
                        model: Sub_category,
                        attributes: ["title", "image"]
                    }, {
                        model: Item,
                        attributes: ["name"]
                    }, {
                        model: Item_size,
                        attributes: ["size", "price"]
                    }]
                }
            });
            count = await Order.findAll({ where: { userId: req.user_id, status: { [Op.or]: ['Ordered', 'Packed', 'Shipped'] } } });
        }
        if (order.length === 0) {
            return res.json({ message: 'No more orders found!', status: 1 });
        }
        return res.json({ message: 'Order details fetched successfully.', order: order, total_order: count.length, status: 1 });

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ ErrorMessage: 'Failed to fetch details', status: 0 });
    }

}

exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ where: { userId: req.user_id, id: req.body.orderId } });
        if (!order) {
            return res.status(404).json({ ErrorMessage: 'Order not found!', status: 0 });
        }

        order.status = 'Cancelled';
        order.cancellation_reason = req.body.cancellation_reason;
        await order.save();

        return res.status(200).json({ message: 'Order Cancelled SuccessFully!', status: 1 });
    } catch (error) {
        return res.status(400).json({ ErrorMessage: error || 'Something went wrong!', status: 0 });
    }
}

exports.getOrderStatus = async (req, res, next) => {

    try {
        const status = await Order.findOne({ where: { userId: req.user_id, id: req.query.orderId } });
        if (!status) {
            return res.status(404).json({ ErrorMessage: 'Order not found!', status: 0 });
        }
        return res.status(200).json({ message: 'Order Status Fetched SuccessFully!', order_status: status.status, status: 1 });
    } catch (error) {
        return res.status(400).json({ ErrorMessage: error || 'Something went wrong!', status: 0 });
    }
}

exports.getRec = (req, res, next) => {
    Item.findAll({
        limit: 20,
        attributes: ["id", "name", "order_count"],
        order: [['order_count', 'DESC']],
        include: [{
            model: Item_image,
            attributes: ["id", "image"]
        }, {
            model: Item_size,
            attributes: ["id", "size", "price"]
        }]
    }).then(item => {
        res.json(item);
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ ErrorMessage: err || 'Something went worong!', status: 0 })
    })
}