const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  ownEmail: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  tempUserData: {
     ownEmail:{
        type:String,
        required:true,
        unique:true
},
    clgEmail:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    clgName:{
        type:String,
        required:true
    }

  }
});

const otpModel = mongoose.model("OTP", otpSchema);

module.exports = otpModel;
