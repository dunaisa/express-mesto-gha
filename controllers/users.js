const User = require('../models/user');
const { NOT_FOUND, SERVER_ERROR, BAD_REQUEST } = require('../Components/HttpError');
const { ObjectNotFound } = require('../Components/ObjectNotFound');

// Возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Создает пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Возвращает пользователя по id
const findUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        return res.status(NOT_FOUND).send({ message: errors.message });
      } else if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.params.userId} не является валидным идентификатором пользователя.` });
      } else {
        return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
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
      } else if (errors.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      } else if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.user._id} не является валидным идентификатором пользователя.` });
      } else {
        return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
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
        return res.status(NOT_FOUND).send({ message: erros.message });
      } else if (errors.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      } else if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.user._id} не является валидным идентификатором пользователя.` });
      } else {
        return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  findUser,
  updateUserInfo,
  updateUserAvatar
};
