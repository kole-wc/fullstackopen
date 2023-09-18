const jwt  = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }

  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  request.user = await User.findById(decodedToken.id);

  next();
};

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'TypeError') {
    return response.status(400).json({ error: error.messege });
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: error.message });
  }

  next(error);
};

module.exports = { 
  errorHandler,
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint
};