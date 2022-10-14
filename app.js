const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { auth } = require('./middlewares/auth');
const { celebrate, Joi } = require('celebrate');

const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

// app.use((req, res, next) => {
//   req.user = {
//     _id: '632b5fac514391b5b8d3e7b1',
//   };

//   next();
// });

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', login);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый путь не существует.' });
});

app.use(auth);

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });

  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
