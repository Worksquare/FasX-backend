const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, '..', 'certificate', 'key.pem');
const certPath = path.join(__dirname, '..', 'certificate', 'cert.pem');

const config = {
    KEY: fs.readFileSync(keyPath, 'utf8'),
    CERT: fs.readFileSync(certPath, 'utf8')
}

module.exports = config;