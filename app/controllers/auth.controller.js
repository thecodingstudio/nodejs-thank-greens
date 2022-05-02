require('dotenv').config();
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const request = require('request');
const axios = require("axios").default;

// Import models.
const User = require('../models/user');

/*
 * Regiser new user.
 * Check whether user is already exist or not.
 * If not then creat new user.
 * Create customer on Stripe.
*/
exports.Register = (req, res, next) => {

  User.findOne({ where: { email: req.body.email } })
    .then(async user => {

      // Check whether user is already exists or not.
      // if (user) {
      //   const error = new Error('User already exists!');
      //   error.statusCode = 409;
      //   throw error;
      // }

      let resp;
      // Create user with encrypted password.
      try {

        const options = {
          method: 'POST',
          url: 'https://thank-greens.us.auth0.com/dbconnections/signup',
          headers: { 'content-type': 'application/json' },
          form: {
            client_id: 'OZWOkCc5809mQ1JIYUUgs3Md1lvW7OTe',
            connection: 'Username-Password-Authentication',
            email: req.body.email,
            password: req.body.password,
            username: req.body.name,
            name: req.body.name,
            picture: "http://example.org/jdoe.png",
            user_metadata: {
              country_code: req.body.country_code,
              phone: req.body.phone
            }
          }
        };

        request(options, async (error, response, body) => {
          resp = JSON.parse(body);
          if (resp.statusCode === 400) {
            return next(resp);
          }

          try {
            const payload = {
              id: resp._id,
              name: req.body.name,
              email: req.body.email,
              country_code: req.body.country_code,
              phone: req.body.phone
            }
            const new_user = await User.create(payload);

            return res.status(200).json({
              message: "User created successfully",
              data: {
                id: new_user.id,
                name: new_user.name,
                data: resp
              },
              status: 1
            });
          } catch (error) {
            console.log(error);
            return next(error);
          }

        });
      }
      catch (err) {
        console.log(err)
        const error = new Error('User creation failed!');
        error.statusCode = 422;
        throw error;
      }


    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}

/*
 * Login controller.
*/
exports.Login = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;
  let resp;
  var options = {
    method: 'POST',
    url: 'https://thank-greens.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      grant_type: 'password',
      username: email,
      password: password,
      audience: 'https://www.thank-greens.com/',
      scope: 'openid offline_access',
      client_id: 'OZWOkCc5809mQ1JIYUUgs3Md1lvW7OTe',
      client_secret: 'hJlRZITNumXAD9c51CYksk78fyrL1Ag92h5jinLfRNxNOc0yoPGIyGt7Mqw0Ir4a'
    }
  };

  request(options, function (error, response, body) {
    resp = JSON.parse(body);
    if (resp.statusCode === 400) {
      return next(resp);
    }

    return res.status(200).json({
      message: "Login successfully.",
      data: JSON.parse(body),
      status: 1
    });

  });
}

exports.refreshToken = (req, res, next) => {

  var options = {
    method: 'POST',
    url: 'https://thank-greens.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form:
    {
      grant_type: 'refresh_token',
      client_id: 'OZWOkCc5809mQ1JIYUUgs3Md1lvW7OTe',
      client_secret: 'hJlRZITNumXAD9c51CYksk78fyrL1Ag92h5jinLfRNxNOc0yoPGIyGt7Mqw0Ir4a',
      refresh_token: req.body.refresh_token
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    return res.status(200).json({
      message: "Get access token successfully.",
      data: JSON.parse(body),
      status: 1
    });
  });
}

exports.changePassword = (req, res, next) => {
  var options = {
    method: 'POST',
    url: 'https://thank-greens.us.auth0.com/dbconnections/change_password',
    headers: { 'content-type': 'application/json' },
    form:
    {
      client_id: 'OZWOkCc5809mQ1JIYUUgs3Md1lvW7OTe',
      username: req.body.email,
      connection: 'Username-Password-Authentication'
    }
  }

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    
    return res.status(200).json({
      message: "Reset password link send successfully",
      data: body,
      status: 1
    });
  });

}