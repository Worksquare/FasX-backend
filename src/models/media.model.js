const mongoose = require('mongoose');
const { User } = require('./user.model');

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = {
  Media,
};
