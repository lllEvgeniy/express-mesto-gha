const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/Not-found-err');
const {
  ERROR_MESSAGE,
} = require('../utils/constants');

const createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(ERROR_MESSAGE.CREATE_CARDS_ERROR));
      }
      return next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => next(err));
};

const deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CARDSID);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(ERROR_MESSAGE.INCORRECT_CARDSID));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CARDSID);
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return next(new BadRequest(ERROR_MESSAGE.LIKE_CARDID_DATA_ERROR));
    }
    return next(err);
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CARDSID);
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return next(new BadRequest(ERROR_MESSAGE.LIKE_CARDID_DATA_ERROR));
    }
    return next(err);
  });

module.exports = {
  createCards,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
