const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Banner = sequelize.define('banner' , {
    image: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_test: {
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

module.exports = Banner;