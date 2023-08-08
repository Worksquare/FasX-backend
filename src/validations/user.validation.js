const Joi = require('joi');
const { password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    surName: Joi.string().required(),
    address: Joi.string(),
    phoneNumber: Joi.string(),
    city: Joi.string(),
  }),
};

// vehicleType, color, model, chasisNumber, plateNumber, ownedSince
const createPartnerDocument = {
  body: Joi.object().keys({
    color: Joi.string().required().custom(password),
    model: Joi.string().required(),
    chasisNumber: Joi.string().required(),
    plateNumber: Joi.string().required(),
    ownedSince: Joi.string(),
    vehicleType: Joi.string().valid('car', 'bicycle', 'bike', 'lorry', 'bus', 'boat'),
    locationGeometry: Joi.array().items(Joi.string()).required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    email: Joi.string(),
    userType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    isVerified: Joi.boolean(),
  }),
};

const verifyPartner = {
  body: Joi.object().keys({
    adminId: Joi.number().required(),
    partnerId: Joi.number(),
    isVerified: Joi.boolean(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      firstName: Joi.string().required(),
      surName: Joi.string().required(),
      identification: Joi.string().required(),
      profileImage: Joi.string(),
      phoneNumber: Joi.string().required(),
      vehicleType: Joi.string().valid('car', 'bicycle', 'bike', 'lorry', 'bus', 'boat').required(),
      locationGeometry: Joi.array().items(Joi.string()),
    })
    .min(1),
};
const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createPartnerDocument,
  verifyPartner,
};
