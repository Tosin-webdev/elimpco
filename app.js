const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const authController = require('./controllers/authController');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
// const bookingRouter = require('./routes/bookingRoutes');

const helmet = require('helmet');

const app = express();

// load env variables
require('dotenv').config();

require('./db/mongoose');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

app.options('*', cors());
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

// app.post('/webhook-checkout', bodyParser.raw({ type: 'application/json' }), bookingController.webhookCheckout);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
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

// console.log(process.env.NODE_ENV);

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('*', authController.isLoggedIn);

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
// app.use('/api/v1/bookings', bookingRouter);

// app.all('*', (req, res, next) => {
//   // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
//   // err.status = 'fail';
//   // err.statusCode = 404;

//   next(new AppError(`Can't find ${req.originalUrl} on this server!`));
// });

app.use((req, res) => {
  res.status(404).render('404');
});

app.use(globalErrorHandler);

module.exports = app;
