const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUserDocument = async (partnerDocument) => {
  if (await User.findByid(partnerDocument.userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User do not exist');
  }
  const userDocument = User.findByIdAndUpdate(
    partnerDocument.userId,
    {
      userId: partnerDocument.userId,
      vehicleType: partnerDocument.vehicleType,
      color: partnerDocument.color,
      model: partnerDocument.model,
      chasisNumber: partnerDocument.chasisNumber,
      plateNumber: partnerDocument.plateNumber,
      ownedSince: partnerDocument.ownedSince,
      role: 'rider',
    },
    { new: true }
  );
  return userDocument;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Searching riders by address, city, and vehicle type
 * @param {ObjectId} address
 * @param {Object} city
 * @param {Object} vehicleType
 * @returns {Promise<User>}
 */
const searchRiders = async (address, city, vehicleType) => {
  const query = { role: 'rider' };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  };

  if (address) {
    const addressRegex = new RegExp(escapeRegExp(address), 'i');
    query.address = { $regex: addressRegex };
  }

  if (city) {
    const cityRegex = new RegExp(escapeRegExp(city), 'i');
    query.city = { $regex: cityRegex };
  }

  if (vehicleType) {
    query.vehicleType = vehicleType;
  }

  const riders = await User.find(query);
  return riders;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  searchRiders,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  createUserDocument,
};
