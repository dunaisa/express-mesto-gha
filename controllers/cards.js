const Card = require('../models/card');
const {
  ObjectNotFound,
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST,
} = require('../Components/HttpError');

// Возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

// Создает карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Удаление карточки по id
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new ObjectNotFound('Карточка не найдена.'))
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        return res.status(NOT_FOUND).send({ message: `Карточка с указанным id ${req.params.cardId} не найдена.` });
      } if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.params.cardId} не является валидным идентификатором карточки.` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ObjectNotFound('Передан несуществующий id карточки.'))
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      } if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.params.cardId} не является валидным идентификатором карточки.` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Убрать лайк с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // убрать _id из массива
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ObjectNotFound('Передан несуществующий id карточки.'))
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'ObjectIdIsNotFound') {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      } if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.params.cardId} не является валидным идентификатором пользователя.` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
