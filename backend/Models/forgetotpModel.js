const mongoose = require('mongoose');

const forgototpSchema = new mongoose.Schema({
  ownEmail: { type: String, required: true }, // email of the user
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});


forgototpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const forgototpModel = mongoose.model("ForgotOTP", forgototpSchema);

module.exports = forgototpModel;
