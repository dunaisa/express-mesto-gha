const Card = require('../models/card');
const {
  NOT_FOUND,
  BAD_REQUEST,
} = require('../Components/HttpError');

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
    // .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
    .catch(next);
};

// Создает карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    // .catch((errors) => {
    //   if (errors.name === 'ValidationError') {
    //     return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
    //   }
    //   // return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    // })
    .catch(next);
};

// Удаление карточки по id
const deleteCard = (req, res, next) => {
  const ownerId = req.user._id;

  Card.findById(req.params.cardId)
    .orFail(new ObjectNotFound(`Карточка с указанным id ${req.params.cardId} не найдена.`))
    .then((card) => {
      if (card) {
        if (card.owner.toString() !== ownerId) {
          // return res.status(403).send({ message: `Карточка с указанным id ${req.params.cardId} принадлежит другому пользователю.` });
          throw new ForbiddenError(`Карточка с указанным id ${req.params.cardId} принадлежит другому пользователю.`);
        }
      } else {
        card.delete();
        return res.send({ data: card });
      }
    })
    .catch((errors) => {
      if (errors.name === 'CastError') {
        // return res.status(BAD_REQUEST).send({ message: `${req.params.cardId} не является валидным идентификатором карточки.` });
        next(new BadRequest(`${req.params.cardId} не является валидным идентификатором карточки.`))
      }
      // return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      return false;
    })
    .catch(next);
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
      if (errors.name === 'ObjectIdIsNotFound') {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      } if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.params.cardId} не является валидным идентификатором карточки.` });
      }
      // return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      return false;
    })
    .catch(next);
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
      if (errors.name === 'ObjectIdIsNotFound') {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      } if (errors.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `${req.params.cardId} не является валидным идентификатором пользователя.` });
      }
      // return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      return false;
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
