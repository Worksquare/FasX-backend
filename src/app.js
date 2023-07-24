const cors = require('cors')
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const responseTime = require('response-time');
const passport = require('passport');

const apiV1 = require('./routes/api.v1');
const handleError = require('./middlewares/error');
const limiter = require('./config/rate.limit');
const setupPassport = require('./config/passport');

const app = express();

// Security configuration
app.use(helmet()); // adds security headers
app.use(cors()); // enables Cross-Origin Resource Sharing
app.options('*', cors()); // cross-origin resource sharing for all routes
app.use(mongoSanitize()); // prevent SQL injection
app.use(hpp()); //HTTP Param Pollution
app.use(limiter); //limit queries per 15mn

// Enable parsing Json payload  in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logs information about incoming requests and outgoing responses in the terminal
app.use(morgan('combined'));

// Adds an X-Response-Time for indicating the server's response time in milliseconds.
app.use(responseTime());

// Passport Middleware configuration
setupPassport()
app.use(passport.initialize());

// Routes configuration
app.use('/v1', apiV1);
app.use('/*', (req, res, next) => res.status(404).json({ message: 'Page not found' }));

// Error handling middleware
app.use(handleError);

module.exports = app;