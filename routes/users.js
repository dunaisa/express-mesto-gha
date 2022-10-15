const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');

const {
  getUsers,
  findUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.get('/users/me', getCurrentUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().min(24),
  }).unknown(true),
}), findUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }).unknown(true),
}), updateUserAvatar);

module.exports = router;
