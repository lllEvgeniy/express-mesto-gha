const { errors, celebrate, Joi } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');

const { createUser, login } = require('./controllers/users');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MONGO_URL);
const app = express();

app.use(express.json());
app.disable('x-powered-by');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(7),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(7),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), createUser);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Не найдено' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
