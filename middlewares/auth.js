const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/Not-found-err');

function auth(req, res, next) {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new NotFoundError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
}

module.exports = auth;
