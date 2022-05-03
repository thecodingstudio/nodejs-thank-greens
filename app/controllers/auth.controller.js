require('dotenv').config();
const request = require('request');
let json_body;

// Import models.
const User = require('../models/user');

/*
 * Regiser new user in auth0.
 * Check whether user is already exist or not.
 * Create customer on Stripe.
*/
exports.Register = (req, res, next) => {

  User.findOne({ where: { email: req.body.email } })
    .then(async user => {

      // Check whether user is already exists or not.
      if (user) {
        const error = new Error('User already exists!');
        error.statusCode = 409;
        throw error;
      }

      const options = {
        method: 'POST',
        url: 'https://thank-greens.us.auth0.com/dbconnections/signup',
        headers: { 'content-type': 'application/json' },
        form: {
          client_id: process.env.CLIENT_ID,
          connection: process.env.CONNECTION,
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          picture: "http://example.org/jdoe.png"
        }
      }

      // Make sing-up request to third party Auth0 api.
      try {

        request(options, async (error, response, body) => {

          if (error) {
            console.log(error);
            return res.json(500).json({
              ErrorMessage: 'Some Auth0 error while making singup request!',
              status: 0
            })
          }

          // Check whether any logical error is occurd or not.
          json_body = JSON.parse(body);
          if (json_body.statusCode === 400) {
            return next(json_body);
          }

          // Save additional info of user in database.
          try {

            const user = await User.findByPk(json_body.id);
            user.country_code = req.body.country_code;
            user.phone = req.body.phone;
            await user.save();

            // Send success responce.
            return res.status(200).json({
              message: "User created successfully",
              data: {
                id: json_body.id,
                name: json_body.name,
                email: json_body.email
              },
              status: 1
            })

          }
          catch (err) {
            console.log(err)
            return res.json(500).json({
              ErrorMessage: 'Some database error while creating user!',
              status: 0
            })
          }

        })
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

  var options = {
    method: 'POST',
    url: 'https://thank-greens.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      grant_type: 'password',
      username: email,
      password: password,
      audience: process.env.AUDIENCE,
      scope: 'offline_access',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }
  };

  // Make login request to third party Auth0 api.
  try {

    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
        return res.json(500).json({
          ErrorMessage: 'Some Auth0 error while making login request!',
          status: 0
        })
      }

      // Check whether any logical error is occurd or not.
      json_body = JSON.parse(body);
      if (json_body.statusCode === 400) {
        return next(json_body);
      }

      // Send success responce.
      return res.status(200).json({
        message: "Login successfully.",
        access_token: json_body.access_token,
        refresh_token: json_body.refresh_token,
        expires_in: json_body.expires_in,
        token_type: json_body.token_type,
        status: 1
      });

    });
  }
  catch (err) {
    console.log(err)
    const error = new Error('Login failed!');
    error.statusCode = 422;
    throw error;
  }
}

/*
 * Refresh token controller.
*/
exports.refreshToken = (req, res, next) => {

  var options = {
    method: 'POST',
    url: 'https://thank-greens.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form:
    {
      grant_type: 'refresh_token',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: req.body.refresh_token
    }
  };

  // Make refresh token request to third party Auth0 api.
  try {
    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
        return res.json(500).json({
          ErrorMessage: 'Some Auth0 error while making refresh_token request!',
          status: 0
        })
      }

      // Check whether any logical error is occurd or not.
      json_body = JSON.parse(body);
      if (json_body.statusCode === 400) {
        return next(json_body);
      }

      // Send success responce.
      return res.status(200).json({
        message: "Get access token successfully.",
        access_token: json_body.access_token,
        expires_in: json_body.expires_in,
        token_type: json_body.token_type,
        status: 1
      });

    });

  }
  catch (err) {
    console.log(err)
    const error = new Error('Getting refresh token failed!');
    error.statusCode = 422;
    throw error;
  }
}

/*
 * Forgot password controller.
*/
exports.forgotPassword = (req, res, next) => {

  var options = {
    method: 'POST',
    url: 'https://thank-greens.us.auth0.com/dbconnections/change_password',
    headers: { 'content-type': 'application/json' },
    form:
    {
      client_id: process.env.CLIENT_ID,
      username: req.body.email,
      connection: process.env.CONNECTION
    }
  }

  try {

    // Make forgot_password request to third party Auth0 api.
    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
        return res.json(500).json({
          ErrorMessage: 'Some Auth0 error while making forgot_password request!',
          status: 0
        })
      }
  
      // Send success reponse.
      return res.status(200).json({
        message: "Reset password link send to your email successfully",
        status: 1
      });

    });
    
  } 
  catch (err) {
    console.log(err)
    const error = new Error('Forgot password failed!');
    error.statusCode = 422;
    throw error;
  }
  
}