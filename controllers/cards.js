const Card = require('../models/card');
const { ValidationError, ObjectNotFound, ServerError } = require('../Components/HttpError');

// Возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      const ServerErr = new ServerError('Произошла ошибка.');
      return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
    });
};

// Создает карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'ValidationError') {
        const IncorrectInputValue = new ValidationError('Переданы некорректные данные.');
        return res.status(IncorrectInputValue.status).send({ message: IncorrectInputValue.message });
      }
      const ServerErr = new ServerError('Произошла ошибка.');
      return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
    });
};

// Удаление карточки по id
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new ObjectNotFound('Карточка не найдена.'))
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        const UserNotFound = new ObjectNotFound(`Карточка с указанным id ${req.params.cardId} не найдена.`);
        return res.status(UserNotFound.status).send({ message: UserNotFound.message });
      } else if (errors.name === 'CastError') {
        const UserIdNotValid = new ValidationError(`${req.params.cardId} не является валидным идентификатором карточки.`);
        return res.status(UserIdNotValid.status).send({ message: UserIdNotValid.message });
      }
      const ServerErr = new ServerError('Произошла ошибка.');
      return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
    });
};

// Поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new ObjectNotFound('Передан несуществующий id карточки.'))
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        const CardNotFound = new ObjectNotFound('Передан несуществующий id карточки.');
        return res.status(CardNotFound.status).send({ message: CardNotFound.message });
      } else if (errors.name === 'ValidationError') {
        const IncorrectInputValue = new ValidationError('Переданы некорректные данные.');
        return res.status(IncorrectInputValue.status).send({ message: IncorrectInputValue.message });
      } else if (errors.name === 'CastError') {
        const UserIdNotValid = new ValidationError(`${req.params.cardId} не является валидным идентификатором карточки.`);
        return res.status(UserIdNotValid.status).send({ message: UserIdNotValid.message });
      }
      const ServerErr = new ServerError('Произошла ошибка.');
      return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
    });
};

// Убрать лайк с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // убрать _id из массива
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new ObjectNotFound('Передан несуществующий id карточки.'))
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        const CardNotFound = new ObjectNotFound('Передан несуществующий id карточки.');
        return res.status(CardNotFound.status).send({ message: CardNotFound.message });
      } else if (errors.name === 'ValidationError') {
        const IncorrectInputValue = new ValidationError('Переданы некорректные данные.');
        return res.status(IncorrectInputValue.status).send({ message: IncorrectInputValue.message });
      } else if (errors.name === 'CastError') {
        const UserIdNotValid = new ValidationError(`${req.params.cardId} не является валидным идентификатором пользователя.`);
        return res.status(UserIdNotValid.status).send({ message: UserIdNotValid.message });
      }
      const ServerErr = new ServerError('Произошла ошибка.');
      return res.status(ServerErr.status).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};
