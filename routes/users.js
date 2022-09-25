const router = require('express').Router();

const {
  getUsers,
  createUser,
  findUser,
  updateUserInfo,
  updateUserAvatar
} = require('../controllers/users');

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:userId', findUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
