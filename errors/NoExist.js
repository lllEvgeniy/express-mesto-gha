class NoExistEmail extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = NoExistEmail;
