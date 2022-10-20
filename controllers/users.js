const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  NOT_FOUND,
  BAD_REQUEST,
  SERVER_ERROR,
  ERROR_MESSAGE,
} = require('../utils/constants');

const getUser = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR }));
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10);
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }));

  User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
    email: req.body.email,
    password: req.body.password,
  })

    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.CREATE_USER_ERROR });
      }
      return res.status(SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.PATCH_BAD_REQUEST });
      }
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: ERROR_MESSAGE.NOT_FOUND_USERID });
      }
      return res.status(SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.PATCH_BAD_REQUEST });
      }
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: ERROR_MESSAGE.NOT_FOUND_USERID });
      }
      return res.status(SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.PATCH_BAD_REQUEST });
      }
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: ERROR_MESSAGE.GET_NOT_FOUND });
      }
      return res.status(SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return res.send({ token: jwt.sign({ _id: User._id }, 'some-secret-key', { expiresIn: '7d' }) });
        });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const currentUser = (req, res) => {
  User.findById(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.PATCH_BAD_REQUEST });
      }
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: ERROR_MESSAGE.NOT_FOUND_USERID });
      }
      return res.status(SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
    });
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
  login,
  currentUser,
};
