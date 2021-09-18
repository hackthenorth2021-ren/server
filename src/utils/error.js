const errorHandler = (err, _req, res, _next) => {
  if (!err.status || err.status == 500) {
    console.error(err);
    if (err.stack) {
      console.error(err.stack);
    }
    res.status(500).send({ status: 500, message: 'Internal Server Error.' });
  } else {
    res.status(err.status).send(err);
  }
}

class HttpError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.errorMsg = message;
    this.data = data;
  }
}

exports.HttpError = HttpError;
exports.errorHandler = errorHandler;