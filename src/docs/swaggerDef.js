const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'FAST-X LOGISTICS API DOCUMENTATION',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/Worksquare/FasX#readme',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
