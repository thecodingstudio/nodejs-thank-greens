const Category = require('../models/category');
const Sub_category = require('../models/sub_category');
const Item = require('../models/item');
const Item_image = require('../models/item_image');
const Item_size = require('../models/item_size');


const cloudinary = require('../utils/upload');

exports.postCategory = async (req, res, next) => {

    Category.findOne({
        where: {
            title: req.body.title
        }
    }).then(async category => {
        if (!category) {

            const image = await cloudinary.uploader.upload(req.files[0].path, {
                public_id: req.files[0].filename + '_category',
                width: 500,
                height: 500,
                crop: 'fill',
            });

            Category.create({
                title: req.body.title,
                image: image.url
            })
                .then(category => {
                    return res.status(200).json({ message: 'Category Stored!', data: category, status: 1 })
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });

        } else {
            return res.json({ error: "CATEGORY ALREADY EXISTS", status: 0 })
        }
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}


exports.postSubCategory = async (req, res, next) => {

    Sub_category.findOne({
        where: {
            title: req.body.title
        }
    }).then(async sub_category => {
        if (!sub_category) {

            const image = await cloudinary.uploader.upload(req.files[0].path, {
                public_id: req.files[0].filename + '_sub_category',
                width: 500,
                height: 500,
                crop: 'fill',
            });

            Sub_category.create({
                title: req.body.title,
                image: image.url,
                categoryId: req.body.category_id
            })
                .then(sub_category => {
                    return res.status(200).json({ message: 'Sub_Category Stored!', data: sub_category, status: 1 })
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });

        } else {
            return res.json({ error: "SUB_CATEGORY ALREADY EXISTS", status: 0 })
        }
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}


exports.postItem = (req, res, next) => {

    Item.findOne({
        where: {
            name: req.body.name
        }
    }).then(async item => {
        if (!item) {

            try {
                const sub_category = await Sub_category.findByPk(req.body.sub_category_id);

                const payload = {
                    name: req.body.name,
                    subCategoryId: sub_category.id,
                    categoryId: sub_category.categoryId
                }

                const new_item = await Item.create(payload);

                for (let i = 0; i < req.files.length; i++) {

                    const image = await cloudinary.uploader.upload(req.files[i].path, {
                        public_id: req.files[i].filename + '_Item',
                        width: 500,
                        height: 500,
                        crop: 'fill',
                    });

                    try {
                        
                        await Item_image.create({
                            image: image.url,
                            itemId: new_item.id
                        });
                    } catch (error) {
                        console.log(error);
                        return next(error);
                    }

                }

                let size_list = [];
                const parseData = JSON.parse(req.body.size);

                for (let i in parseData) {
                    size_list.push({
                        size: parseData[i].size,
                        price: parseData[i].price,
                        itemId: new_item.id
                    });
                }

                const item_size = await Item_size.bulkCreate(size_list);

                return res.status(200).json({ message: "Item created." });
            }
            catch (error) {
                console.log(error);
                return next(error);
            }

        } else {
            return res.json({ error: "ITEM ALREADY EXISTS PLEASE TRY WITH OTHER NAME", status: 0 })
        }
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}