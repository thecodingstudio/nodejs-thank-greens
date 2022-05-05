const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Item_size = sequelize.define('item_size' , {
    size: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price : {
        type : Sequelize.DECIMAL(5,2),
        allowNull: false
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

module.exports = Item_size;