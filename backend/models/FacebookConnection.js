const mongoose = require('mongoose');

module.exports = mongoose.model('FacebookConnection', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pageId: String,
  pageName: String,
  pageAccessToken: String,
  pageProfilePictureUrl: String,
  connectedAt: { type: Date, default: Date.now }
}));
