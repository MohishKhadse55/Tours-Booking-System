const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const viewRouter = require('./routes/viewRouter');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouter');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middleware

// Serving static Files
app.use(express.static(`${__dirname}/public`));

// Set security http header
// app.use(helmet());

// development login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request form same API
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many request form the ip, Please try again after in an hour ',
});
app.use('/api', limiter);

// Body parser... For reading data formt the body into req.body
app.use(express.json({ limit: '10kb' })); // middleware
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// data Sanitization against xss
app.use(xss());

// prevetn html parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficilty',
      'price',
    ],
  })
); // whitelisting allows duplicate in the query string0

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this Server`,
  // });
  // err = new Error(`Can't find ${req.originalUrl} on this Server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new appError(`Can't find ${req.originalUrl} on this Server`), 404);
});

app.use(globalErrorHandler);

module.exports = app;
