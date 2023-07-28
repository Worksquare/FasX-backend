const { z } = require('zod');
const UserModel = require('../models/user.model');
const DeliveryPartnerModel = require('../models/deliveryPartner.model');

const validateCreateUserObject = z.object({
  firstName: z.string()
    .nonempty('First name is required')
    .max(50, 'First name must not exceed 50 characters'),
  
  surName: z.string()
    .nonempty('Surname is required')
    .max(50, 'Surname must not exceed 50 characters'),
  
  address: z.string()
    .nonempty('Address is required')
    .max(100, 'Address must not exceed 100 characters'),
  
  city: z.string()
    .nonempty('City is required')
    .max(50, 'City must not exceed 50 characters'),
  
  email: z.string()
    .nonempty('Email address is required')
    .email('Invalid email address')
    .refine(async (value) => {
      const trimmedEmail = value.trim().toLowerCase();
      const user = await UserModel.findOne({ email: trimmedEmail });
      return !user;
    }, {
      message: 'Email address already exist',
    }),
  
  phoneNumber: z.string()
    .nonempty('Phone number is required')
    .min(3, 'Phone number must be at least 3 characters long')
    .max(15, 'Phone number must not exceed 15 characters')
    .refine(async (value) => {
      const trimmedNumber= value.trim()
      const user = await UserModel.findOne({ phoneNumber: trimmedNumber });
      return !user;
    }, {
      message: 'Phone number already exist',
    }),
  
  password: z.string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long')
  
});

const validateCreateRiderObject = z.object({
  vehicleType: z.string()
    .nonempty('Vehicle Type is required'),
  
  color: z.string()
    .nonempty('Color is required'),
  
  model: z.string()
    .nonempty('Model is required'),

  chasisNumber: z.string()
    .nonempty('Chasis number is required'),
  
  plateNumber: z.string()
    .nonempty('Plate number is required'),
  
  ownedSince: z.string()
    .nonempty('Data is required'),
  
})

const validateLoginCredentials = z.object({
  email: z.string()
    .nonempty('Email address is required')
    .email('Invalid email address'),
  
  password: z.string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long')
});

const validatePasswordChange = z.object({
  newPassword: z.string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

const validateEmailAddress = z.object({
  email: z.string()
    .nonempty('Email address is required')
    .email('Invalid email address'),
});

module.exports = {
  validateCreateUserObject,
  validateCreateRiderObject,
  validateLoginCredentials,
  validatePasswordChange,
  validateEmailAddress
}