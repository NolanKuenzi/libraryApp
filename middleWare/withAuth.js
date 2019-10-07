const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const withAuth = function(req, res, next) {
const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
  if (!token) {
    if (req.query.axios === undefined) {
      res.render('error', {status: 401, errMessage: 'Unauthorized: Please Login to Continue'});
    } else {
      res.status(401).json('Unauthorized: Please Login to Continue');
    }
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        if (req.query.axios === undefined) {
          res.render('error', {status: 401, errMessage: 'Unauthorized: Invalid Credentials, Please try again'});
        } else {
          res.status(401).json('Unauthorized: Invalid Credentials, Please try again');
        }
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

module.exports = withAuth;