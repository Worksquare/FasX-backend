const { unlinkSync } = require('fs');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const { uploads, deleteFile } = require('../config/cloudinary');
const { Media } = require('../models/media.model');
const ApiError = require('../utils/ApiError');

/**
 * Upload files
 * @param {Object} file
 * @returns {Promise<Object>}
 */
const uploadFile = async (file) => {
  if (!file) return null;
  logger.info('uploading file');

  // get file type
  const fileType = file.mimetype;
  logger.info('got file type');

  // upload file to cloudinary
  const { url, publicId } = await uploads(file.path);
  logger.info('uploaded file');

  // delete file from server
  unlinkSync(file.path);
  logger.info('deleted file from server');

  // save file to database
  const media = await Media.create({ url, publicId, type: fileType });
  logger.info('saved file to database');

  return { url: media.url };
};

/**
 * Get file
 * @param {string} url
 * @returns {Promise<Object>}
 */
const getFile = async (url) => {
  const file = await Media.findOne({ url });
  return file;
};

/**
 * Delete file
 * @param {string} url
 * @returns {Promise<Object>}
 */
const deleteUploadedFile = async (url) => {
  const file = await getFile(url);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }

  await deleteFile(file.publicId);
  logger.info('deleted file from cloudinary');

  await file.remove();
  logger.info('deleted file from database');
  return file;
};

module.exports = {
  uploadFile,
  deleteUploadedFile,
};
