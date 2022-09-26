const { NOT_FOUND } = require('../Components/HttpError');

class ObjectNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'ObjectIdIsNotFound';
    this.status = NOT_FOUND;
  }
}

module.exports = {
  ObjectNotFound
};