const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }).unknown(true),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }).unknown(true),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }).unknown(true),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }).unknown(true),
}), dislikeCard);

module.exports = router;
