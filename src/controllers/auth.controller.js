const authService = require('../services/auth.service');
const BlacklistToken = require('../models/blacklistToken.model');
const {
    validateCreateUserObject,
    validateCreateRiderObject,
    validateLoginCredentials,
    validatePasswordChange,
    validateEmailAddress
} = require('../validations/auth.validation');

/**
 * @desc Register a new user
 * @route POST /v1/auth/register
 * @access Public
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpRegisterUser(req, res, next) {
    try {
        const { firstName, surName, email, address, city, phoneNumer, password } = req.body;
        const userData = await validateCreateUserObject
            .parseAsync({ firstName, surName, email, address, city, phoneNumer, password });

        const result = await authService.registerUser(userData);

        res.status(201).json({
            message: 'User registered successfully',
            accessToken: result.accessToken,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Send mail to resend OTP
 * @route GET /v1/auth/resend_otp
 * @access Private
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpMailForResendOTP(req, res, next) {
    try {
        const { id } = req.user;

        const result = await authService.mailForResendOTP(id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Confirm user registration with OTP
 * @route PUT /v1/auth/confirm
 * @access Private
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpConfirmUser(req, res, next) {
    try {
        const { id } = req.user;
        const { OTP } = req.body;

        const result = await authService.confirmUserRegistration(id, OTP);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * @desc User login
 * @route POST /v1/auth/login
 * @access Public
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpLoginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        const userData = validateLoginCredentials.parse({ email, password });

        const result = await authService.loginUser(userData);

        res.json({
            message: 'User login successfully',
            accessToken: result.accessToken,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Send mail for password reset
 * @route POST /v1/auth/forgot_password
 * @access Public
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpMailForPasswordReset(req, res, next) {
    try {
        const { email } = req.body;

        const userData = validateEmailAddress.parse({ email });

        const result = await authService.mailForPasswordReset(userData);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Validate OTP for password reset
 * @route PUT /v1/auth/validate_token?token=value&email=value
 * @access Private
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpValidateOTPForPasswordReset(req, res, next) {
    try {
        const { token, email } = req.query;

        console.log('req.query', req.query)

        await authService.validateOTPForPasswordReset(token, email);

        // I will have to resend the user to where they can change their password. 
        // TODO, I will change this route to the frontend route.
        res.status(301).redirect('/v1/auth/reset_password')
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Reset user password
 * @route PUT /v1/auth/reset_password
 * @access Private
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpResetUserPassword(req, res, next) {
    try {
        const { email, newPassword } = req.body;

        const userData = validatePasswordChange.parse({ email, newPassword });

        const result = await authService.resetUserPassword(id, userData);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Register a new rider
 * @route POST /v1/auth/register/rider
 * @access Public
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpRegisterRider(req, res, next) {
    try {
        const { firstName, surName, email, address, city, phoneNumer, password } = req.body;
        const riderData = await validateCreateUserObject
            .parseAsync({ firstName, surName, email, address, city, phoneNumer, password });

        const result = await authService.registerRider(riderData);

        res.status(201).json({
            message: 'Rider registered successfully',
            accessToken: result.accessToken,
            user: result.user
        });;
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Register a new rider
 * @route POST /v1/auth/register/rider-docs
 * @access Private
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpRegisterRiderDocs(req, res, next) {
    try {
        const { id } = req.user;
        const { typeVehicle, color, model, chasisNumber, plateNumber, ownedSince } = req.body;

        const riderData = await validateCreateRiderObject
            .parseAsync({ typeVehicle, color, model, chasisNumber, plateNumber, ownedSince });

        const result = await authService.registerRiderDocs(id, riderData);

        res.status(201).json({
            message: 'Rider registered successfully',
            accessToken: result.accessToken,
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Resend OTP for account unlock
 * @route PUT /v1/auth/resend_otp_unlock
 * @access Public
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpMailForResendUnlockOTP(req, res, next) {
    try {
        const { email } = req.body;

        const result = await authService.mailForResendUnlockOTP(email);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Validate OTP for account unlock
 * @route PUT /v1/auth/unlock_account
 * @access Public
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpUnlockAccount(req, res, next) {
    try {
        const { OTP, email } = req.body;

        const result = await authService.unlockAccount(email, OTP);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Google callback route to give user access token
 * @route GET /v1/auth/google/callback
 * @access Private
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Function} - The success response or an error.
 */
async function httpGoogleCallback(req, res, next) {
    try {
        const profile = req.user;
        const { status, data } = await authService.handleGoogleCallback(profile);

        res.status(status).json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @desc Logout user
 * @route GET /v1/auth/logout
 * @access Private
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @returns {Function} - The success response or an error.
 */
async function httpLogoutUser(req, res, next) {
    try {
        const authHeader = req.header('Authorization') || req.header('authorization');
        const token = authHeader && authHeader.split(' ')[1];

        await BlacklistToken.create({ token });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    httpRegisterUser,
    httpMailForResendOTP,
    httpConfirmUser,
    httpLoginUser,
    httpMailForPasswordReset,
    httpValidateOTPForPasswordReset,
    httpResetUserPassword,
    httpRegisterRider,
    httpRegisterRiderDocs,
    httpMailForResendUnlockOTP,
    httpUnlockAccount,
    httpGoogleCallback,
    httpLogoutUser,
};