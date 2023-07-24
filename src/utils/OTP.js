const crypto = require('crypto')
const bcrypt = require('bcrypt');

const OTPModel = require('../models/otp.model');
const ErrorResponse = require('./error.response');

async function storeOTP(email, otp) {
    try {
        const hashOTP = await bcrypt.hash(otp, 10);
        await OTPModel.create({ email, otp: hashOTP });
    } catch (error) {
        throw new ErrorResponse(error.message, 500)
    }
}

async function verifyOTP(otp, email){
    try {
        const OTP = await OTPModel.findOne({ email });

        const isMatch = await bcrypt.compare(otp, OTP.otp);

        if (isMatch) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500)
    }
}

async function deleteOTP(email) {
    try {
        const OTP = await OTPModel.findOne({ email });

        if (OTP) {
            await OTPModel.deleteOne({ email });
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new ErrorResponse(error.message, 500)
    }
}

function generateOTP() {
    const digits = '0123456789';
    const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase();
    const specialChars = '#!&@';

    const allowedChars = digits + lowerCaseAlphabets + upperCaseAlphabets + specialChars;

    let OTP = '';
    for (let i = 0; i < 10; i++) {
        const charIndex = crypto.randomInt(0, allowedChars.length);
        OTP += allowedChars[charIndex];
    }

    return OTP;
}

module.exports = { storeOTP, verifyOTP, deleteOTP, generateOTP };