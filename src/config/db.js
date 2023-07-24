const mongoose = require('mongoose');
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/fastx';

mongoose.connection.once('open', () => console.log('MongoDB connection is ready'));
mongoose.connection.on('error', err => console.error(err.message));

async function dbConnect() {
    try {
        await mongoose.connect(MONGODB_URL);
    } catch (error) {
        console.error(error.message);
    }
}

async function dbDisconnect() {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = { dbConnect, dbDisconnect };