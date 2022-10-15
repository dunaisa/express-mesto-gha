const { BAD_REQUEST } = require('./HttpError');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'badRequest';
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = {
  BadRequest,
};