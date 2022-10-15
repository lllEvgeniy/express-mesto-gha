const router = require('express').Router();
const {
  createCards, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', createCards);

router.get('/', getCards);

router.delete('/:cardId', deleteCardById);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
