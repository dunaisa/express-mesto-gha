const { NOT_FOUND } = require('./HttpError');

class ObjectNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'ObjectIdIsNotFound';
    this.status = NOT_FOUND;
  }
}

module.exports = {
  ObjectNotFound,
};
