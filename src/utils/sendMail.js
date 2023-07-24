const Mailgen = require('mailgen');
require("dotenv").config();

const transporter = require('./transporter');
const ErrorResponse = require('./error.response');

const MailGenerator = new Mailgen({
	theme: "default",
	product: {
		name: "FastX Logistics Application",
		link: process.env.BASE_URL || 'http://localhost:3000'
	}
});

const sendMail = async (otp, email, options, name) => {
	const BASE_URL = process.env.BASE_URL;
	let response;

	if (options === 'register') {
		const url = `${BASE_URL}/v1/auth/confirm`;

		response = {
			body: {
				name: `${name}`,
				intro: `<h2>Account Created!</h2><br>
                <p>Congratulations! Your account has been successfully created.</p>
                <p>Here is your OTP: <b>${otp}</b></p>
                <p>Click this link to <a href="${url}">Verify Account</a>.</p>`,
				outro: `<p>Please, if you did not request this email, ignore it.</p>`,
			}
		}
	} else if (options === 'forgot password') {
		const url = `${BASE_URL}/v1/auth/validate_otp`;

		response = {
			body: {
				name: `${name}`,
				intro: `<h2>Reset Password!</h2><br>
                <p>We received a request to reset your password.</p>
                <p>Here is your OTP: <b>${otp}</b></p>
                <p>Copy the OTP and click <a href="${url}">Verify OTP</a>.</p>`,
				outro: `<p>Please, if you did not request this email, ignore it.</p>`,
			}
		}
	} else if (options === 'login attempts') {
		const url = `${BASE_URL}/v1/auth/unlock_account`;

		response = {
            body: {
                name: `${name}`,
                intro: `<h2>Account Locked!</h2>,<br>
                <p>We detected multiple failed login attempts on your account.</p>
                <p>Here is your OTP: <b>${otp}</b></p>
                <p>Your account has been locked due to multiple login attempts. 
                To unlock your account, visit the <a href="${url}">Unlock Account</a> page and enter your email address and OTP.</p>`,
                outro: `<p>Please, if you did not request this email, ignore it.</p>`,
            },
        }
	} else {
		response = {
            body: {
                name: `${name}`,
				intro: `<h2>'Invalid Option!</h2><br>
				<p>Please note that the option you selected is invalid.</p>`,
                outro: `<p>Kindly visit the correct URL.</p>`,
            },
        };
	}

	const mail = MailGenerator.generate(response);

	const message = {
		from: `'FastX Logistics App✔' <${process.env.EMAIL}>`,
		to: email,
		subject: 'Authentication',
		html: mail
	}
	
	transporter.sendMail(message)
		.catch(error => { throw new ErrorResponse(error.message, 500) });
}

module.exports = sendMail;