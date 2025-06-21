const express = require('express');
const router = express.Router();
const { handleMessage } = require('../services/fbService');
const { sendMessage } = require('../services/replyService');
const auth = require('../middleware/auth');
const User = require('../models/User'); // Assuming the User model is in models/User.js

router.post('/send', auth, async (req, res) => {
  const { recipientId, messageText } = req.body;
  const userId = req.user.id;

  try {
    // Find user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const pageAccessToken = user.fbPage.accessToken;
    const result = await sendMessage(pageAccessToken, recipientId, messageText);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
