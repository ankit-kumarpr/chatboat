const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: false // Now optional since messages can be files only
  },
  files: [{
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
    url: String
  }],
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
