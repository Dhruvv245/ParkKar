const path = require(`path`);
const express = require('express');
const globalErrorHandler = require(`./controllers/errorController`);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require(`express-mongo-sanitize`);
const xss = require(`xss-clean`);
const cors = require(`cors`);
const cookieParser = require(`cookie-parser`);
const compression = require('compression');

const parkingRouter = require(`./routes/parkingRouter`);
const userRouter = require(`./routes/userRouter`);
const reviewRouter = require(`./routes/reviewRouter`);
const bookingRouter = require(`./routes/bookingRouter`);
const viewRouter = require(`./routes/viewRouter`);
const AppError = require(`./utils/appError`);

const app = express();

// Trust proxy when deployed on cloud platforms (Railway, Heroku, etc.)
app.set('trust proxy', 1);

//Setting the view engine
app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `views`));

//Global Middlewares-

//Parse data from cookies into req.cookies
app.use(cookieParser());

//Serving static files
app.use(express.static(path.join(__dirname, `public`)));

//Implement CORS
app.use(
  cors({
    origin: [
      `http://localhost:3000`,
      `https://parkkar-production.up.railway.app`
    ],
    credentials: true,
  })
);
app.options(`*`, cors());
//Set Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         'https://cdn.jsdelivr.net',
//         'https://cdnjs.cloudflare.com',
//         'https://unpkg.com',
//       ],
//       connectSrc: ["'self'", 'ws://localhost:50006/'],
//     },
//   })
// );
//Limit requests from same IP
const rateLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests! Try again in an hour`,
});
app.use(`/api`, rateLimiter);
//Body parser,reading data from body into req.body
app.use(express.json({ limit: `10kb` }));
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());

app.use(compression());

// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use(`/`, viewRouter);
app.use(`/api/v1/parkings`, parkingRouter);
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/reviews`, reviewRouter);
app.use(`/api/v1/bookings`, bookingRouter);
app.all(`*`, (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
