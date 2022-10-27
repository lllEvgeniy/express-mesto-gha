const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

function auth(req, res, next) {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
}

module.exports = auth;
