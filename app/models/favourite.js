const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Favourites = sequelize.define('favourite' , {
    createdAt: {
        type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    },
    updatedAt: {
        type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    }
});

module.exports = Favourites;