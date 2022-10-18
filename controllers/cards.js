const Card = require('../models/card');

const {
  ForbiddenError,
} = require('../Components/ForbiddenError');

const {
  BadRequest,
} = require('../Components/BadRequest');

const {
  ObjectNotFound,
} = require('../Components/ObjectNotFound');

// Возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Создает карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки.'));
      } else {
        return next(errors);
      }
    });
};

// Удаление карточки по id
const deleteCard = (req, res, next) => {
  const ownerId = req.user._id;

  Card.findById(req.params.cardId)
    .orFail(new ObjectNotFound(`Карточка с указанным id ${req.params.cardId} не найдена.`))
    .then((card) => {
      if (card) {
        if (card.owner.toString() === ownerId) {
          card.delete()
            .then(() => res.send({ data: card }))
            .catch(next);
        } else {
          next(new ForbiddenError(`Карточка с указанным id ${req.params.cardId} принадлежит другому пользователю.`));
        }
      }
    })
    .catch((errors) => {
      if (errors.name === 'CastError') {
        next(new BadRequest(`${req.params.cardId} не является валидным идентификатором карточки.`));
      } else {
        return next(errors);
      }
    });
};

// Поставить лайк карточке

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ObjectNotFound('Передан несуществующий id карточки.'))
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'CastError') {
        next(new BadRequest(`${req.params.cardId} не является валидным идентификатором карточки.`));
      } else {
        return next(errors);
      }
    });
  // .catch(next);
};

// Убрать лайк с карточки

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // убрать _id из массива
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ObjectNotFound('Передан несуществующий id карточки.'))
    .then((card) => res.send({ data: card }))
    .catch((errors) => {
      if (errors.name === 'CastError') {
        next(new BadRequest(`${req.params.cardId} не является валидным идентификатором карточки.`));
      } else {
        return next(errors);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
