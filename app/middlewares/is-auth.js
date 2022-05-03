require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');
var cert = fs.readFileSync('thank-greens.pem');

module.exports = (req, res, next) => {
    const authenticated = req.get('Authorization');
    if (!authenticated) {
        return res.status(401).json({ message: "User not Authenticated" });
    }
    const token = authenticated.split(' ')[1];

    jwt.verify(token, cert, (err, user) => {
        if (!err) {
            req.user_id = user.sub.split('|')[1];
            next();
        } else {
            return res.status(401).json({ message: "User not Authenticated" });
        }
    })
}