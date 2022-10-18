const { UNAUTHORIZED_ERROR } = require('./HttpError');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauthorized';
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}

module.exports = {
  UnauthorizedError,
};
