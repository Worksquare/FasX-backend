const bcrypt = require('bcrypt');

const UserModel = require('../models/user.model');
const ErrorResponse = require('../utils/error.response');
const { generateToken } = require('../utils/token');
const generateAvatar = require('../utils/generateAvatar');
const sendMail = require('../utils/sendMail');
const { storeOTP, verifyOTP, deleteOTP, generateOTP } = require('../utils/OTP');

// Register a new user
async function registerUser(userData) {
    try {
        const avatar = generateAvatar(userData.email);
        const user = { ...userData, avatar };
        const savedUser = await UserModel.create(user);

        const otp = generateOTP();
        await storeOTP(savedUser.email, otp);
        await sendMail(otp, savedUser.email, 'register', savedUser.name);
        const accessToken = generateToken(savedUser._id, 'confirm');

        return {
            accessToken,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        };
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Send mail to resend OTP
async function mailForResendOTP(userId) {
    try {
        const user = await UserModel.findById(userId).select('-password');
        if (!user) throw new ErrorResponse('User not found', 404);

        if (!user.isConfirmed) {
            await deleteOTP(user.email);
            
            const otp = generateOTP();
            await storeOTP(user.email, otp);
            await sendMail(otp, user.email, 'register', user.name);

            return { message: 'Mail sent successfully' };
        } else {
            throw new ErrorResponse('User already confirmed', 400);
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Confirm user's mail with OTP
async function confirmUserRegistration(userId, OTP) {
    try {
        const user = await UserModel.findById(userId).select('-password -confirmPassword');
        if (!user) throw new ErrorResponse('User not found', 404);

        if (user.isConfirmed) throw new ErrorResponse('User already confirmed', 400);

        const storedOTP = await verifyOTP(OTP, user.email);
        if (storedOTP) {
            user.isConfirmed = true;
            await deleteOTP(user.email);
            const updatedUser = await user.save();

            return {
                message: 'OTP verified successfully and User is confirmed',
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                }
            };
        } else {
            throw new ErrorResponse('Invalid OTP', 400);
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// User login
async function loginUser(email, password) {
    try {
        let user = await UserModel.findOne({ email });
        if (!user) throw new ErrorResponse('Incorrect credentials', 400);

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const MaximumLoginAttempts = 7;
            user.loginAttempts += 1;

            if (user.loginAttempts === MaximumLoginAttempts) {
                const otp = generateOTP();
                const hashOTP = await bcrypt.hash(otp, 10);

                user.isLocked = true;
                user.OTPStore = hashOTP;
                await user.save();

                await sendMail(otp, user.email, 'login attempts', user.name);

                throw new ErrorResponse('Account locked due to multiple login attempts. Check your email for unlock instructions.', 400);
            }

            await user.save();
            const RemainingLoginAttempts = MaximumLoginAttempts - user.loginAttempts;

            throw new ErrorResponse(`Invalid credentials... RemainingLoginAttempts = ${RemainingLoginAttempts}`, 400);
        }

        const accessToken = user.generateAccessToken();
        user.loginAttempts = 0;
        user.lastLogin = new Date();
        await user.save();

        return {
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Resend OTP for account unlock
async function mailForResendUnlockOTP(email) {
    try {
        const user = await UserModel.findOne({ email }).select('-password -confirmPassword');
        if (!user) throw new ErrorResponse('User not found', 404);

        if (user.isLocked && user.OTPStore) {
            const otp = generateOTP();
            const hashOTP = await bcrypt.hash(otp, 10);

            user.OTPStore = hashOTP;
            await user.save();

            await sendMail(otp, user.email, 'login attempts', user.name);

            return { message: 'Mail sent successfully.' };
        } else {
            throw new ErrorResponse('Account not locked', 400);
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Validate OTP for account unlock
async function unlockAccount(email, OTP) {
    try {
        const user = await UserModel.findOne({ email }).select('-password -confirmPassword');
        if (!user) throw new ErrorResponse('User not found', 404);

        if (user.isLocked && user.OTPStore) {
            const isMatch = await bcrypt.compare(OTP, user.OTPStore);

            if (isMatch) {
                user.OTPStore = null;
                user.loginAttempts = 0;
                user.isLocked = false;
                await user.save();

                return { message: 'Account successfully unlocked.' };
            } else {
                throw new ErrorResponse('Invalid OTP', 400);
            }
        } else {
            throw new ErrorResponse('Account not locked', 400);
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Send mail for password reset
async function mailForPasswordReset(userData) {
    try {
        const user = await UserModel.findOne({ email: userData.email }).select('-password');
        if (!user) throw new ErrorResponse('User not found', 404);

        if (user.isConfirmed) {
            const otp = generateOTP();
            await storeOTP(user.email, otp);
            await sendMail(otp, user.email, 'forgot password', user.name);

            const accessToken = generateToken(user._id, 'reset');

            return {
                message: 'Mail sent successfully',
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        } else {
            throw new ErrorResponse('Email not confirmed', 400);
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Validate OTP for password reset
async function validateOTPForPasswordReset(userId, OTP) {
    try {
        const user = await UserModel.findById(userId).select('-password');
        if (!user) throw new ErrorResponse('User not found', 404);

        const storedOTP = await verifyOTP(OTP, user.email);

        if (storedOTP) {
            user.otpTracker = true;
            await user.save();

            return { message: 'OTP verified successfully.' };
        } else {
            throw new ErrorResponse('Invalid OTP', 400);
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Reset user password
async function resetUserPassword(userId, userData) {
    try {
        let user = await UserModel.findById(userId);
        if (!user) throw new ErrorResponse('User not found', 404);
        if (!user.otpTracker) throw new ErrorResponse('OTP not Verified', 400);

        user.password = userData.newPassword;
        user.otpTracker = false;
        await user.save();

        return { message: 'Password reset successfully, kindly login' };
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

module.exports = {
    registerUser,
    mailForResendOTP,
    confirmUserRegistration,
    loginUser,
    unlockAccount,
    mailForResendUnlockOTP,
    mailForPasswordReset,
    validateOTPForPasswordReset,
    resetUserPassword
};