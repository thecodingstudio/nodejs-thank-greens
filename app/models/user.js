const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user' , {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.TEXT,
        defaultValue: null
    },
    country_code: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    is_verify: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    resetToken:{
        type: Sequelize.TEXT,
        defaultValue: null
    },
    resetTokenExpiration: {
        type: Sequelize.DATE,
        defaultValue: null
    }
},
{
    timestamps: true
})

module.exports = User;