const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
}


// try {
//   const payload = jwt.verify(YOUR_JWT, JWT_SECRET);
//   console.log('\x1b[31m%s\x1b[0m', `
//   Надо исправить. В продакшне используется тот же
//   секретный ключ, что и в режиме разработки.
//   `);
// } catch (err) {
//   if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
//     console.log(
//       '\x1b[32m%s\x1b[0m',
//       'Всё в порядке. Секретные ключи отличаются'
//     );
//   } else {
//     console.log(
//       '\x1b[33m%s\x1b[0m',
//       'Что-то не так',
//       err
//     );
//   }
// }



module.exports = auth;
