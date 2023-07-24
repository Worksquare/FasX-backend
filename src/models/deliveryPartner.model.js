const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availability: { type: Boolean, default: true }, // Delivery partner availability
  // Additional delivery partner fields
});

const DeliveryPartnerModel = mongoose.model('DeliveryPartner', deliveryPartnerSchema);

module.exports = DeliveryPartnerModel;