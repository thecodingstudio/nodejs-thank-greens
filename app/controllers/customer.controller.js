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


// exports.postFav = async (req, res, next) => {
//     const userId = req.user.id;
//     const catererId = req.body.catererId;

//     try {
//         const fav = await Favourites.create({ userId: userId, catererId: catererId })
//         return res.status(200).json({ message: "Added to Favourites!", result: fav, status: 1 })
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ error: err || 'Something went wrong!', status: 0 });
//     }
// }

// exports.getFav = async (req, res, next) => {
//     const userId = req.user.id;

//     try {

//         const favs = await Favourites.findAll({ where: { userId: userId } });
//         if (favs.length === 0) {
//             return res.status(400).json({ message: "No Favourites Found!", status: 1 })
//         }
//         let caterers = [];
//         for (let i = 0; i < favs.length; i++) {
//             const cat = await User.findByPk(favs[i].catererId);
//             caterers.push(cat);
//         }
//         return res.status(200).json({ message: "Favourites Caterers Found!", result: caterers, status: 1 })

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ error: err || 'Something went wrong!', status: 0 });
//     }
// }

// exports.deleteFav = async (req, res, next) => {
//     const userId = req.user.id;
//     const catererId = req.body.id;
//     try {

//         await Favourites.destroy({ where: { catererId: catererId, userId: userId } })
//         return res.status(200).json({ message: "Removed from favourites!", status: 1 })
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ error: err || 'Something went wrong!', status: 0 });
//     }
// }