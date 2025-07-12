// const mongoose = require('mongoose');

// const ChatMessageSchema = new mongoose.Schema({
//   session: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'LiveSession',
//     required: true
//   },
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   sentAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('ChatMessage', ChatMessageSchema);


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
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
