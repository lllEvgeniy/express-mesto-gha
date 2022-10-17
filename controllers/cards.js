const mongoose = require('mongoose');
const Card = require('../models/card');

const {
  NOT_FOUND,
  BAD_REQUEST,
  SERVER_ERROR,
  ERROR_MESSAGE,
} = require('../utils/constants');

const createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.CREATE_CARDS_ERROR });
      }
      return res.status(SERVER_ERROR).send({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
      });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: ERROR_MESSAGE.NOT_FOUND_CARDSID });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.INCORRECT_CARDSID });
      }
      return res.status(SERVER_ERROR)
        .send({
          message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: ERROR_MESSAGE.NOT_FOUND_CARDSID });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.LIKE_CARDID_DATA_ERROR });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.LIKE_CARDID_DATA_ERROR });
    }
    return res.status(SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: ERROR_MESSAGE.NOT_FOUND_CARDSID });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.LIKE_CARDID_DATA_ERROR });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: ERROR_MESSAGE.LIKE_CARDID_DATA_ERROR });
    }
    return res.status(SERVER_ERROR).send({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
  });

module.exports = {
  createCards,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
