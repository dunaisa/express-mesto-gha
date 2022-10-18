const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const {
  BadRequest,
} = require('../Components/BadRequest');

const {
  ObjectNotFound,
} = require('../Components/ObjectNotFound');

const {
  ConflictError,
} = require('../Components/ConflictError');

const {
  UnauthorizedError,
} = require('../Components/UnauthorizedError');

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

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => res.send(data))
    .catch((errors) => {
      if (errors.code === 11000) {
        return next(new ConflictError('Пользователь с такой почтой уже существует.'));
      } else if (errors.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные при создании карточки.'));
      } else {
        return next(errors);
      }
    });
};

// Возвращает пользователя по id
const findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'CastError') {
        return next(new BadRequest(`${req.params.userId} не является валидным идентификатором пользователя.`));
      } else {
        return next(errors);
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
        return next(new BadRequest('Переданы некорректные данные.'));
      }
      return next(errors);
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
        return next(new BadRequest('Переданы некорректные данные.'));
      }
      return next(errors);
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
      return next(new UnauthorizedError('Необходима авторизация.'))
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
