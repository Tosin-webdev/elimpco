const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const helmet = require('helmet');

const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global middlewares

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Set Security HTTP headers
app.use(helmet());

// Development log
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// This allows 100 request of the same IP adress in 1hr(to prevent Xss attack)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. please try again in an hour',
});

// apply the limiter to all the routes that starts with api
app.use('/api', limiter);

app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attack
app.use(xss());

// Prevent parameter polution (parameter polution pollutes
//  the HTTP parameters of a web application for achieving
// a specific malicious task)
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'],
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base');
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
