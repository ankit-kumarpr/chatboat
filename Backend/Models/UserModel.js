const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  customerRef_no: String,
  userno: String,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  gender: String,
  Address: {
    addressline1: String,
    addressline2: String,
    city: String,
    state: String,
    zip: String,
  },
  otp: String,
  otpExpires: String,
  refreshToken: String,
  isBanned: {
    status: { type: Boolean, default: false },
    reason: String,
    bannedUntil: Date,
  },
  banHistory: [
    {
      action: {
        type: String,
        enum: ['ban', 'unban'],
        required: true,
      },
      reason: String,
      bannedUntil: Date,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  role: {
    type: String,
    enum: ['User', 'Admin', 'SuperAdmin'],
    default: 'User',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
