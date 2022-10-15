const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const {
  BadRequest,
} = require('../Components/BadRequest');

const {
  ObjectNotFound,
} = require('../Components/ObjectNotFound');

// Возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// Создает пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Пользователь с такой почтой уже существует.' });
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then(() => res.send(user));

      return next();
    });
  // .catch(next);
};

// Возвращает пользователя по id
const findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'CastError') {
        throw new BadRequest(`${req.params.userId} не является валидным идентификатором пользователя.`);
      } else {
        return next();
      }
    });
};

// Обновляет профиль
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные.'));
      }
      if (errors.name === 'CastError') {
        next(new BadRequest(`${req.params.userId} не является валидным идентификатором пользователя.`));
      }
      return next();
    });
};

// Обновляет аватар
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные.'));
      }
      if (errors.name === 'CastError') {
        next(new BadRequest(`${req.params.userId} не является валидным идентификатором пользователя.`));
      }
      return next();
    });
};

// Проверяет соответсвие логина

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    })
    .catch(next);
};

// Получает информацию о текущем пользователе

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  login,
  findUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
};
