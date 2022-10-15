const mongoose = require('mongoose');
const User = require('../models/user');

const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  ERROR_MESSAGE,
} = require('../utils/constants');

const getUser = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR }));
  };

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.CREATE_USER_ERROR });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
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
        return res.status(INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
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
          return res.status(VALIDATION_ERROR).send({ message: ERROR_MESSAGE.PATCH_VALIDATION_ERROR });
        }
        if (err.message === 'NotFound') {
          return res.status(NOT_FOUND).send({ message: ERROR_MESSAGE.NOT_FOUND_USERID });
        }
        return res.status(INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
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
        return res.status(INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
      });
  };

  module.exports = {
    createUser,
    getUser,
    getUserById,
    updateUser,
    updateAvatar,
  };