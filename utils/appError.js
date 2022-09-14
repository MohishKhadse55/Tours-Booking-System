class appError extends Error {
  constructor(message, statusCode) {
    super(message); // passing the message and not this.message .... think why
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // default error code which
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = appError;
