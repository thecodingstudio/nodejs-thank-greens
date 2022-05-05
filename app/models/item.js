const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Item = sequelize.define('item' , {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    discreption : {
        type: Sequelize.TEXT,
        defaultValue : "It's a fine item"
    },
    order_count: {
        type: Sequelize.INTEGER(11)
    },
    is_test: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
    },
    is_verify: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
    },
    is_active: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
    },
    is_delete: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
    },
    createdAt: {
        type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    },
    updatedAt: {
        type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    }
});

module.exports = Item;