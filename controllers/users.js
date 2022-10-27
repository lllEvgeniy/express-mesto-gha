const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/Not-found-err');
const BadRequest = require('../errors/BadRequest');
const ExistEmail = require('../errors/ExistEmail');
const NoExist = require('../errors/NoExist');

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
    .then((user) => {
      const newUser = {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };
      res.send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ExistEmail(ERROR_MESSAGE.EXIST_EMAIL));
      }
      if ((err.name === 'ValidationError')) {
        next(new BadRequest(ERROR_MESSAGE.PATCH_BAD_REQUEST));
      }
      next(err);
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
        throw new NoExist(ERROR_MESSAGE.ERROR_LOGIN_OR_PASS);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoExist(ERROR_MESSAGE.ERROR_LOGIN_OR_PASS);
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.cookie('jwt', token, {
            maxAge: 3600000 * 12 * 7,
            httpOnly: true,
            sameSite: true,
          })
            .send({ token });
        });
    })
    .catch(next);
};

const currentUser = (req, res, next) => {
  User.findById(
    req.user._id,
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
