const mongoose = require('mongoose');

module.exports = mongoose.model('Conversation', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pageId: String,
  psid: String,
  messages: [{
    direction: String,
    text: String,
    timestamp: Number,
  }],
  lastUpdated: Number
}));
