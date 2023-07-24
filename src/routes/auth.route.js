const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    httpRegisterUser,
    httpMailForResendOTP,
    httpConfirmUser,
    httpLoginUser,
    httpUnlockAccount,
    httpMailForResendUnlockOTP,
    httpMailForPasswordReset,
    httpValidateOTPForPasswordReset,
    httpResetUserPassword,
    httpLogoutUser,
    httpGoogleCallback,
} = require('../controllers/auth.controller');

const {
    authenticate,
    authenticateToken
} = require('../middlewares/auth');

// Jwt Auth
router.post('/register', httpRegisterUser);
router.get('/resend_otp', authenticateToken('confirm'), httpMailForResendOTP);
router.put('/confirm', authenticateToken('confirm'), httpConfirmUser);
router.post('/login', httpLoginUser);
router.put('/unlock_account', httpUnlockAccount);
router.put('/resend_otp_unlock', httpMailForResendUnlockOTP);
router.post('/forgot_password', httpMailForPasswordReset);
router.put('/validate_otp', authenticateToken('reset'), httpValidateOTPForPasswordReset);
router.put('/reset_password', authenticateToken('reset'), httpResetUserPassword);
router.get('/logout', authenticate, httpLogoutUser);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/v1/auth/failure' }), httpGoogleCallback);

// Oauth Auth failure route
router.get('/failure', (req, res) => res.redirect('/v1/auth/google'));

module.exports = router;