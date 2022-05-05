const User = require('../models/user');
const Category = require('../models/category');
const Sub_category = require('../models/sub_category');
const Item = require('../models/item');
const Item_image = require('../models/item_image');
const Item_size = require('../models/item_size');

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