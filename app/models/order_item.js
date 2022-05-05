const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Order_item = sequelize.define('order_item', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    size: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER(5),
        allowNull: false
    },
    is_test: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
    },
    createdAt: {
        type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    },
    updatedAt: {
        type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    }
});

module.exports = Order_item;