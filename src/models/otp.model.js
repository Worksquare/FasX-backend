const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    }
}, { timestamps: true });

otpSchema.index({ createdAt: 1 }, { expires: 60 * 5 });

const OTPModel = mongoose.model('OTP', otpSchema);

module.exports = OTPModel;