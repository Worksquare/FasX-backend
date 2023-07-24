const express = require('express');
const router = express.Router();

const authRoute = require('./auth.route');
const swaggerRouter = require('../config/swagger');

router.use('/auth', authRoute);
router.use('/api-docs', swaggerRouter);

module.exports = router;