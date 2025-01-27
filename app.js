const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

// START EXPRESS APP
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARES

// Implement CORS
app.use(cors());

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving satic files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https://*.stripe.com', 'https://api.mapbox.com', 'https://events.mapbox.com', 'https://tiles.mapbox.com'],
      styleSrc: [
        "'self'",
        'https://fonts.googleapis.com',
        'https://api.mapbox.com',
        'https://events.mapbox.com',
        'https://tiles.mapbox.com',
        'https://www.gstatic.com', 
        "'unsafe-inline'"
      ],
      scriptSrc: [
        "'self'",
        'https://api.mapbox.com',
        'https://events.mapbox.com',
        'https://tiles.mapbox.com',
        'https://js.stripe.com',
        'blob:',
        'https://cdn.jsdelivr.net',
        'https://www.gstatic.com', 
        "'unsafe-inline'"
      ],
      workerSrc: [
        "'self'", 
        'blob:'
      ],
      connectSrc: [
        "'self'", 
        'https://api.mapbox.com', 
        'https://events.mapbox.com', 
        'https://tiles.mapbox.com',
        'https://*.stripe.com',
        'ws://127.0.0.1:*', 
        'http://127.0.0.1:*', 
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https://api.mapbox.com',
        'https://events.mapbox.com',
        'https://tiles.mapbox.com',
        'https://*.stripe.com',
        'blob:'
      ],
      frameSrc: ["'self'", 'https://*.stripe.com']
    }
  })
);

// Handle source map requests
app.use((req, res, next) => {
  if (req.url.endsWith('.map')) {
    return res.status(404).end();
  }
  next();
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!' 
});
app.use('/api', limiter);

app.post('/webhook-checkout', express.raw({ type: 'application/json' }), bookingController.webhookCheckout);

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty', 
      'price'
    ],
  }),
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;