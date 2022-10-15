const router = require('express').Router();
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
router.get('/users/:userId', findUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
