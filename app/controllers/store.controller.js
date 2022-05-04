const Category = require('../models/category');
const Sub_category = require('../models/sub_category');

const cloudinary = require('../utils/upload');

exports.postCategory = async (req, res, next) => {
    
    Category.findOne({
        where: {
            title: req.body.title
        }
    }).then(async category => {
        if (!category) {
            
            const image = await cloudinary.uploader.upload(req.files[0].path, {
                public_id: req.files[0].filename +'_category',
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
                public_id: req.files[0].filename +'_sub_category',
                width: 500,
                height: 500,
                crop: 'fill',
            });

            Sub_category.create({
                title: req.body.title,
                image: image.url,
                categoryId : req.body.category_id
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