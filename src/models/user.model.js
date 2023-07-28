const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // User details
    avatar: { type: String, required: true },
    firstName: { type: String, trim: true, required: true },
    surName: { type: String, trim: true, required: true },
    email: { type: String, unique: true },
    address: { type: String },
    city: { type: String },
    phoneNumber: { type: String, trim: true, unique: true },
    password: { type: String },
    isConfirmed: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'rider'], default: 'user' },

    // Security Values
    isLocked: { type: Boolean, default: false }, 
    loginAttempts: { type: Number, default: 0 },
    OTPStore: { type: String },
    otpTracker: { type: Boolean, default: false },

    // OAuth Values
    googleId: { type: String },
    facebookId: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);

        this.password = hashedPassword;

        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        return false;
    }
}

userSchema.methods.generateAccessToken = function () {
    const payload = {
        id: this._id,
        role: this.role,
        iat: Date.now()
    };

    const options = {
        expiresIn: '1d'
    };

    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, options);
}

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
