const mongoose = require('mongoose');

const centralAccountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
});

const CentralAccount = mongoose.model('CentralAccount', centralAccountSchema);

module.exports = {
  CentralAccount,
};