const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getRider = {
  query: Joi.object().keys({
    address: Joi.string(),
    city: Joi.string(),
    vehicleType: Joi.string(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const upgradeRider = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      vehicleType: Joi.string().required(),
      color: Joi.string().required(),
      model: Joi.string().required(),
      chasisNumber: Joi.string().required(),
      plateNumber: Joi.string().required(),
      ownedSince: Joi.string().required(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  getRider,
  updateUser,
  upgradeRider,
  deleteUser,
};
