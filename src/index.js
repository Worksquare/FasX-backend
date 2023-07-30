const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoose.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB');

    const server = app.listen(config.port, () => {
      logger.info(`Listening on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      exitHandler();
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received');
      exitHandler();
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      exitHandler();
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection:', reason);
      exitHandler();
    });
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

startServer();
