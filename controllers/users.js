const User = require('../models/user');
const { ValidationError, ObjectNotFound, ServerError } = require('../Components/HttpError');

//Возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => {
      const ServerErr = new ServerError('Произошла ошибка.')
      return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
    });
};

//Создает пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ValidationError') {

        const IncorrectInputValue = new ValidationError('Переданы некорректные данные.')
        return res.status(IncorrectInputValue.status).send({ message: IncorrectInputValue.message })
      } else {
        const ServerErr = new ServerError('Произошла ошибка.')
        return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
      }
    })
};

//Возвращает пользователя по id
const findUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then(user => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        const UserNotFound = new ObjectNotFound('Пользователь не найден.')
        return res.status(UserNotFound.status).send({ message: UserNotFound.message })
      } else if (errors.name === 'ValidationError') {
        const IncorrectInputValue = new ValidationError(`Переданы некорректные данные.`)
        return res.status(IncorrectInputValue.status).send({ message: IncorrectInputValue.message })

      } else if (errors.name === 'CastError') {
        const UserIdNotValid = new ValidationError(`${req.params.userId} не является валидным идентификатором пользователя.`)
        return res.status(UserIdNotValid.status).send({ message: UserIdNotValid.message })
      } else {
        const ServerErr = new ServerError('Произошла ошибка.')
        return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
      }
    })
};

//Обновляет профиль
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then(user => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        const UserNotFound = new ObjectNotFound('Пользователь не найден.')
        return res.status(UserNotFound.status).send({ message: UserNotFound.message })

      } else if (errors.name === 'ValidationError') {
        const IncorrectInputValue = new ValidationError(`Переданы некорректные данные.`)
        return res.status(IncorrectInputValue.status).send({ message: IncorrectInputValue.message })

      } else if (errors.name === 'CastError') {
        const UserIdNotValid = new ValidationError(`${req.user._id} не является валидным идентификатором пользователя.`)
        return res.status(UserIdNotValid.status).send({ message: UserIdNotValid.message })
      } else {
        const ServerErr = new ServerError('Произошла ошибка.')
        return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
      }
    })
};

//Обновляет аватар
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new ObjectNotFound('Пользователь не найден.'))
    .then(user => res.send({ data: user }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        const UserNotFound = new ObjectNotFound('Пользователь не найден.')
        return res.status(UserNotFound.status).send({ message: UserNotFound.message })

      } else if (errors.name === 'ValidationError') {
        const IncorrectInputValue = new ValidationError(`Переданы некорректные данные.`)
        return res.status(IncorrectInputValue.status).send({ message: IncorrectInputValue.message })

      } else if (errors.name === 'CastError') {
        const UserIdNotValid = new ValidationError(`${req.user._id} не является валидным идентификатором пользователя.`)
        return res.status(UserIdNotValid.status).send({ message: UserIdNotValid.message })
      } else {
        const ServerErr = new ServerError('Произошла ошибка.')
        return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
      }
    })
};

module.exports = {
  getUsers,
  createUser,
  findUser,
  updateUserInfo,
  updateUserAvatar
};