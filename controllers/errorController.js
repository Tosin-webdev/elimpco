const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const value = err.keyValue.name;
  // console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value  `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  // res.send(err);
  const errors = Object.values(err.errors).map((el) => el.message);
  // console.log(err);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => new AppError('Invalid Token. Please log in again!', 401);

const handleJWTExpiredError = (err) => new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, res) => {
  // if(err)
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR!!!!!!', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  //   console.log(err.message);
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // let error = { ...err };
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   error: err,
    //   stack: err.stack,
    //   message: err.message,
    // });

    console.log(err.name, err.message);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    // let { error } = err;
    // console.log(error);

    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    // if ((error.code = 11000)) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);
    // if (err.message.includes('jwt malformed')) err = handleJWTMalformedError(err);
    sendErrorProd(err, res);
  }
};

// err.message.includes('User validation failed'
