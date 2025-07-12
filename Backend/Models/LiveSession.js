const mongoose = require('mongoose');

const LiveSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  sessionDate: {
    type: String,
    required: true
  },
  sessionTime:{
    type:String,
    required:true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('LiveSession', LiveSessionSchema);