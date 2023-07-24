const jwt = require('jsonwebtoken');
require("dotenv").config();

const ErrorResponse = require('./error.response');

const generateToken = (id, option) => {
    if (option === 'confirm') {
        return jwt.sign(
            { id },
            process.env.JWT_CONFIRM_TOKEN_SECRET,
            { expiresIn: '10m' }
        );
    } else if (option === 'reset') {
        return jwt.sign(
            { id },
            process.env.JWT_RESET_PASSWORD_SECRET,
            { expiresIn: '7m' }
        );
    }
    else {
        throw new ErrorResponse(`Invalid option: ${option}`, 400);
    }
}

const decodeToken = (token, option) => {
    let decodedToken;
    
    if (option === 'confirm') {
        jwt.verify(
            token,
            process.env.JWT_CONFIRM_TOKEN_SECRET,
            (err, decoded) => {
                if (err) throw new ErrorResponse(err.message, 400);
                decodedToken = decoded;
            }
        );

        return decodedToken.id;
    } else if (option === 'reset') {
        jwt.verify(
            token,
            process.env.JWT_RESET_PASSWORD_SECRET,
            (err, decoded) => {
                if (err) throw new ErrorResponse(err.message, 400);
                decodedToken = decoded;
            }
        );

        return decodedToken.id;
    } else {
        throw new ErrorResponse(`Invalid option: ${option}`, 400);
    }
}

module.exports = { generateToken, decodeToken };