const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // тут будет вся авторизация
  const { authorization } = req.headers;
  console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log(authorization);
    return res.status(401).send({ message: 'Необходима торизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  console.log(token);

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token);

  } catch (err) {
    // отправим ошибку, если не получилось
    return res.status(401).send({ message: 'Необходима' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};

module.exports = {
  auth,
};
