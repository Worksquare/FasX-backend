const { z } = require('zod');
const UserModel = require('../models/user.model')

const validateCreateUserObject = z.object({
  name: z.string()
    .nonempty('Name is required')
    .max(50, 'Name must not exceed 50 characters'),
  
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
  
  password: z.string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long')
  
});

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
    validateLoginCredentials,
    validatePasswordChange,
    validateEmailAddress
}