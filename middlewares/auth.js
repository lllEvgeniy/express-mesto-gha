const jwt = require('jsonwebtoken');
const {
  ERROR_MESSAGE,
} = require('../utils/constants');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError(ERROR_MESSAGE.AUTHORIZATION_ERROR);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthorizationError(ERROR_MESSAGE.AUTHORIZATION_ERROR);
  }

  req.user = payload;

  return next();
}

module.exports = auth;
