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

exports.postOrder = async(req, res, next) => {
    const payload = {
        name : 'Tameto',
        size : '1 kg',
        quantity : 5,
        orderId : 1,
        itemId : 1,
        subCategoryId: 5
    }
    try {
        const order_item = await Order_item.create(payload);
        return res.json(order_item);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ ErrorMessage: 'Failed to fetch details', status: 0 });
    }
}

exports.getOrder = async (req, res, next) => {

    try {

        const order = await Order.findAll({
            include: {
                model: Order_item
            }
        });

        return res.json({ message: 'Order fetched successfully.', data: order, status: 0 });

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ ErrorMessage: 'Failed to fetch details', status: 0 });
    }

}