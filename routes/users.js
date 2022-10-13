const router = require('express').Router();
const auth = require('./middlewares/auth');

const {
  getUsers,
  createUser,
  login,
  findUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.post('/signup', createUser);
router.post('/signin', login);
router.get('/users/:userId', auth, findUser);
router.patch('/users/me', auth, updateUserInfo);
router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;
