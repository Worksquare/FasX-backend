const nodemailer = require('nodemailer');
require("dotenv").config();

// configure the transporter for nodemailer to use gmail account to send mails
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
});

module.exports = transporter;