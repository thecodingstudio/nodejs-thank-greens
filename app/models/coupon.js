const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

const Coupon = sequelize.define('coupon', {
    code: {
        type: Sequelize.UUID,
        allowNull: true,
        unique: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expiry: {
        type: Sequelize.STRING
    },
    is_percentage: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
    },
    value: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 1
    },
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    is_test: {
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

Coupon.beforeCreate(coupon => coupon.code = uuidv4().split('-')[0].toUpperCase());

module.exports = Coupon;