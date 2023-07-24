const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FastX Logistics Application API Documentation',
      version: '1.0.0',
      description: 'Fastx is a logistics app that enables users to book and track deliveries. It employs AI and geolocation for optimized routes, estimated times, and real-time updates. Secure transactions and transparency are ensured using advanced technology. Fastx aims to offer convenient, reliable delivery services while empowering flexible and rewarding opportunities for delivery partners.',
    },
    servers: [
      {
        url: 'https://localhost:3000',
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/swaggerdocs/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

router.use('/', swaggerUi.serve);

router.get('/',
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
    },
  })
);

module.exports = router;