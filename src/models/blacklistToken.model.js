const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

blacklistTokenSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 });

const BlacklistToken = mongoose.model('BlacklistToken', blacklistTokenSchema);

module.exports = BlacklistToken;
