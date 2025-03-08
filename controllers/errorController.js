const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(`. `)}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError(`Invalid token! Please login again`);
const handleJWTExpiredError = () =>
  new AppError(`Your Token has expired! Please login again`);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error('ERROR', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith(`/api`)) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR', err);

      // 2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  } else {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });

      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR', err);

      // 2) Send generic message
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: `Please try again later`,
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === `ValidationError`) err = handleValidatorErrorDB(err);
    if (err.name === `JsonWebTokenError`) err = handleJWTError();
    if (err.name === `TokenExpireError`) err = handleJWTExpiredError();

    sendErrorProd(err, req, res);
  }
};