const https = require( 'https');
require("dotenv").config();

const app = require( './app');
const { dbConnect } = require("./config/db");
const Certificate = require( './config/keys');

const PORT = Number(process.env.PORT) || 3000;
const App = app;

const server = https.createServer({
    key: Certificate.KEY,
    cert: Certificate.CERT ,
}, App);

const startServer = async () => {
    try {
        await dbConnect();

        server.listen(PORT, () => console.log(`App listening at PORT: https://localhost:${PORT}`));
    } catch (error) {
        console.error(error, "App failed to start");
        process.exit(1);
    }
}

startServer();