const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NOT_FOUND, SERVER_ERROR, BAD_REQUEST } = require('../Components/HttpError');
const { ObjectNotFound } = require('../Components/ObjectNotFound');

// Возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((errors) => {
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
  // .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

// Создает пользователя
const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Пользователь с такой почтой уже существует.' });
      }
      bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then((user) => res.send({ email: user.email, password: user.password, }))
        // .catch((errors) => {
        //   console.log(errors)
        //   if (errors.name === 'ValidationError') {
        //     return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
        //   }
        // });
        .catch(next);
    })
};

// Возвращает пользователя по id
const findUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        return res.status(NOT_FOUND).send({ message: errors.message });
      } if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.params.userId} не является валидным идентификатором пользователя.` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Обновляет профиль
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        return res.status(NOT_FOUND).send({ message: errors.message });
      } if (errors.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      } if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.user._id} не является валидным идентификатором пользователя.` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Обновляет аватар
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        return res.status(NOT_FOUND).send({ message: errors.message });
      } if (errors.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      } if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.user._id} не является валидным идентификатором пользователя.` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Проверяет соответсвие логина

const login = (req, res) => {

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // пользователь с такой почтой не найден
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // пользователь найден
      const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' });
      res.send({ token });
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return res.send({ message: 'Всё неверно!' });
        // new Error('Неправильные почта или пароль');
      }
      // аутентификация успешна
      return res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  login,
  findUser,
  updateUserInfo,
  updateUserAvatar,
};
