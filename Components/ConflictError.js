const { CONFLICT_ERROR } = require('./HttpError');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'conflictError';
    this.statusCode = CONFLICT_ERROR;
  }
}

module.exports = {
  ConflictError,
};