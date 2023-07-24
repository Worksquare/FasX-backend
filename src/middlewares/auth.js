const ErrorResponse = require('../utils/error.response');
const { decodeToken } = require('../utils/token');
const passport = require('passport');
const BlacklistToken = require('../models/blacklistToken.model');

/**
 * @desc Middleware to authenticate user's token for access to resource for a longer time.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The next function or an error.
 */
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err || !user) return next(new ErrorResponse('Unauthorized', 401));

    try {
      const authHeader = req.header('Authorization') || req.header('authorization');
      if (!authHeader) return next(new ErrorResponse('Unauthorized', 401));

      const token = authHeader.split(' ')[1];
      const tokenBlacklisted = await BlacklistToken.findOne({ token });
      if (tokenBlacklisted) return next(new ErrorResponse('Unauthorized', 401));

      const { _id, role } = user;

      req.user = { id: _id, role };
      
      next();
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
}

/**
 * @desc Middleware to authenticate user's token for access to resource for a short time.
 *
 * @param {string} tokenType - The type of token to authenticate ('confirm' or 'reset').
 * @returns {Function} - The next function or an error.
 */
function authenticateToken(tokenType) {
  return async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization') || req.header('authorization');

      // Check if Authorization header exists
      if (!authHeader) return next(new ErrorResponse('Unauthorized', 401));

      const token = authHeader && authHeader.split(' ')[1];

      if (!token) return next(new ErrorResponse('Unauthorized', 401));

      const userId = decodeToken(token, tokenType);

      req.user = { id: userId };

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * @desc Middleware to authorize user.
 *
 * @param {Object} roles - Role of the user
 * @returns {Function} - The next function or an error.
 */
function authorize(roles) {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return next(new ErrorResponse('Unauthorized', 401));
    }

    next();
  };
}

module.exports = { authenticate, authenticateToken, authorize };