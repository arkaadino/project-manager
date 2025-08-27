// middleware.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

function setupMiddleware(app) {
  // Security headers
  app.use(helmet());

  // Compression untuk response
  app.use(compression());

  // CORS config
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
  }));

  // Rate limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000 
  });
  app.use(limiter);

  // Parsing request body
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

module.exports = setupMiddleware;
