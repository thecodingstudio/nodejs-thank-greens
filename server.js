const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Define express server amd port.
const app = express();
const PORT = process.env.PORT || 8000;

// Importing routes.
const auth_route = require('./app/routes/auth.routes');
const user_route = require('./app/routes/user.routes');
const store_route = require('./app/routes/store.routes');
const customer_route = require('./app/routes/customer.routes');

// Multer setup.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },

    filename: function (req, file, cb) {
        cb(null, uuidv4().split('-')[4] + '_' + file.originalname);
    }
});

// Parse multer request.
app.use(multer({ storage: storage }).array('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Set headers for all requests.
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Difine API routes.
app.use(auth_route);
app.use(user_route);
app.use('/store', store_route);
app.use('/customer', customer_route);

// Central error handling middleware.
app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    const data = error.data;
    const ErrorMessage = error.message || error.error;
    const ErrorDesc = error.description || error.error_description;
    res.status(statusCode).json({ ErrorMessage: ErrorMessage, ErrorDescription: ErrorDesc, data: data, status: 0 });
});

// Difine simple route.
app.get("/", (req, res) => {
    res.status(200).send('Welcome to Bulff City App backend..');
});

// Define models and it's relationship.
const User = require('./app/models/user');
const Token = require('./app/models/token');
const Address = require('./app/models/address');
const Category = require('./app/models/category');
const Sub_category = require('./app/models/sub_category');
const Item = require('./app/models/item');
const Item_image = require('./app/models/item_image');
const Item_size = require('./app/models/item_size');
const Favourites = require('./app/models/favourite');
const Banner = require('./app/models/banner');
const Order = require('./app/models/order');
const Order_item = require('./app/models/order_item');
const Card = require('./app/models/card');
const Payment = require('./app/models/payment');

Token.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Address.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Sub_category.belongsTo(Category, { constraints: true, onDelete: 'CASCADE' });
Category.hasMany(Sub_category);
Item.belongsTo(Sub_category, { constraints: true, onDelete: 'CASCADE' });
Sub_category.hasMany(Item);
Item.belongsTo(Category, { constraints: true, onDelete: 'CASCADE' });
Category.hasMany(Item);
Item.hasMany(Item_image, { constraints: true, onDelete: 'CASCADE' });
Item.hasMany(Item_size, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Favourites, { constraints: true, onDelete: 'CASCADE' });
Item.hasMany(Favourites, { constraints: true, onDelete: 'CASCADE' });
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Order.hasMany(Order_item);
Order_item.belongsTo(Order, { constraints: true, onDelete: 'CASCADE' });
Order_item.belongsTo(Sub_category);
Sub_category.hasOne(Order_item);
Order_item.belongsTo(Item);
Item.hasOne(Order_item);
Order_item.belongsTo(Item_size);
Item_size.hasOne(Order_item);
Card.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Payment.belongsTo(User);
Payment.belongsTo(Order);

/*
 * Sync MySQL database.
 * Live to on defined port.
 */
const sequelize = require("./app/utils/database");
const { request } = require('http');
sequelize
    .sync({ force: false })
    .then(_database => {
        console.log('Database Connected Successfully.')
    })
    .then((_result) => {
        app.listen(PORT, (_port) => {
            console.log('server running on port : ' + PORT);
        });
    })
    .catch(err => {
        console.log(err);
    });