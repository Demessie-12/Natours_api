const AppError = require('./../utilis/appError');

const handleCastErrorDB = (err) => {
  const message = `INVALID ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsDB = (err) => {
  const message = `Duplicate field value: ${Object.values(
    err.keyValue
  )} . please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleTokenErrorDB = (err) =>
  new AppError('INVALID token: Please log in agian!', 401);

const handleExpiredTokenErrorDB = (err) =>
  new AppError('Your token is expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  console.log(req.originalUrl);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted erroe: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // 1) Log error
    console.error('ERROR', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong due to you coding error',
    });
  } else {
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    }
    // 1) Log error
    console.error('ERROR', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: 'please try again later',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicatedFieldsDB(error);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleTokenErrorDB(error);
    }
    if (error.name === 'TokenExpiredError') {
      error = handleExpiredTokenErrorDB(error);
    }

    sendErrorProd(error, req, res);
  }
};
