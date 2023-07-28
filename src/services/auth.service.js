const bcrypt = require('bcrypt');

const UserModel = require('../models/user.model');
const DeliveryPartnerModel = require('../models/deliveryPartner.model');
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
async function loginUser(userData) {
    try {
        let user = await UserModel.findOne({ email: userData.email });
        if (!user) throw new ErrorResponse('Incorrect credentials', 400);

        const isMatch = await user.comparePassword(userData.password);
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

// Send mail for password reset
async function mailForPasswordReset(userData) {
    try {
        const user = await UserModel.findOne({ email: userData.email }).select('-password');
        if (!user) throw new ErrorResponse('User not found', 404);

        if (user.isConfirmed) {
            const otp = generateOTP();
            await storeOTP(user.email, otp);
            await sendMail(otp, user.email, 'forgot password', user.name);

            return { message: 'Mail sent sucessesfully' }
        } else {
            throw new ErrorResponse('Email not confirmed', 400);
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Validate OTP for password reset
async function validateOTPForPasswordReset(token, email) {
    try {
        const storedOTP = await verifyOTP(token, email);

        if (storedOTP) {
            user.otpTracker = true;
            await user.save();
        } else {
            throw new ErrorResponse('Invalid OTP', 400);
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Reset user password
async function resetUserPassword(userData) {
    try {
        let user = await UserModel.findOne({ email: userData.email });
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

// Register a new user
async function registerRider(riderData) {
    try {
        const avatar = generateAvatar(riderData.email);
        const rider = { ...userData, avatar };
        await UserModel.create(rider);

        const accessToken = generateToken(user._id, 'confirm');

        return {
            accessToken,
            user: {
                id: rider._id,
                name: rider.name,
                email: rider.email
            }
        };
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

// Register a new rider
async function registerRiderDocs(userId, riderData) {
    try {
        const rider = { ...riderData, userId };
        await DeliveryPartnerModel.create(rider);

        const user = await UserModel.findById(userId).select('-password');
        user.role = 'rider';
        await user.save();

        const otp = generateOTP();
        await storeOTP(user.email, otp);
        await sendMail(otp, user.email, 'register', user.name);

        const accessToken = generateToken(user._id, 'confirm');

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


// Google callback route to give user access token
async function handleGoogleCallback(profile) {
    try {
        let user = await UserModel.findOne({ googleId: profile.id });
        let token;

        if (user) {
            token = user.generateAccessToken();
        } else {
            user = await UserModel.create({
                googleId: profile._json.sub,
                firstName: profile._json.give_name,
                surName: profile._json.family_name,
                isConfirmed: profile._json.email_verified,
                email: profile._json.email,
                avatar: profile._json.picture,
            });

            const otp = generateOTP();
            await storeOTP(user.email, otp);
            await sendMail(otp, user.email, 'register', user.name);
            const accessToken = generateToken(user._id, 'confirm');

            return {
                status: 201,
                data: {
                    accessToken,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            };
        }

        return {
            status: 200,
            data: {
                message: 'Google Access granted',
                accessToken: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        };
    } catch (error) {
        throw new ErrorResponse(error.message, 500);
    }
}

module.exports = {
    registerUser,
    mailForResendOTP,
    confirmUserRegistration,
    loginUser,
    mailForPasswordReset,
    validateOTPForPasswordReset,
    resetUserPassword,
    registerRider,
    registerRiderDocs,
    mailForResendUnlockOTP,
    unlockAccount,
    handleGoogleCallback
};