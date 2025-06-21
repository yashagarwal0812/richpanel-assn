const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fbPage: {
    accessToken: String,
    pageId: String,
    pageName: String,
    connected: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model('User', UserSchema);
