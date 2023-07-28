const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availability: { type: Boolean, default: false },
  vehicleType: { type: String, required: true },
  color: { type: String, required: true },
  model: { type: String, required: true },
  chasisNumber: { type: String, required: true },
  plateNumber: { type: String, required: true },
  ownedSince: { type: String, required: true },
}, { timestamps: true });

const DeliveryPartnerModel = mongoose.model('DeliveryPartner', deliveryPartnerSchema);

module.exports = DeliveryPartnerModel;