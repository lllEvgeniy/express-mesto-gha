const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/badRequest');

const {
  ERROR_MESSAGE,
} = require('../utils/constants');

const getUser = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      about: req.body.about,
      name: req.body.name,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(ERROR_MESSAGE.CREATE_USER_ERROR));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId).orFail(new NotFoundError('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest(ERROR_MESSAGE.PATCH_BAD_REQUEST));
      }
      if (err.message === 'NotFound') {
        return next(new NotFoundError(ERROR_MESSAGE.NOT_FOUND_USERID));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
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
  ).orFail(new NotFoundError('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(ERROR_MESSAGE.PATCH_BAD_REQUEST));
      }
      if (err.message === 'NotFound') {
        return next(new NotFoundError(ERROR_MESSAGE.NOT_FOUND_USERID));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new NotFoundError('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(ERROR_MESSAGE.PATCH_BAD_REQUEST));
      }
      if (err.message === 'NotFound') {
        return next(new NotFoundError(ERROR_MESSAGE.GET_NOT_FOUND));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequest(ERROR_MESSAGE.ERROR_LOGIN_OR_PASS);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadRequest(ERROR_MESSAGE.ERROR_LOGIN_OR_PASS);
          }
          return res.send({ token: jwt.sign({ _id: User._id }, 'some-secret-key', { expiresIn: '7d' }) });
        });
    })
    .catch(next);
};

const currentUser = (req, res, next) => {
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
  ).orFail(new NotFoundError('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(ERROR_MESSAGE.PATCH_BAD_REQUEST));
      }
      if (err.message === 'NotFound') {
        return next(new NotFoundError(ERROR_MESSAGE.NOT_FOUND_USERID));
      }
      return next(err);
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
