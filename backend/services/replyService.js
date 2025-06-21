const axios = require('axios');
const Conversation = require('../models/Conversation');

exports.sendMessage = async (pageAccessToken, recipientId, messageText) => {
  try {
    // Send message to Facebook Messenger
    await axios.post(`https://graph.facebook.com/v17.0/me/messages`, {
      recipient: { id: recipientId },
      message: { text: messageText },
    }, {
      params: { access_token: pageAccessToken },
    });

    // Update conversation in the database
    const convo = await Conversation.findOne({ psid: recipientId });
    const msg = { direction: 'outbound', text: messageText, timestamp: Date.now() };

    if (convo) {
      convo.messages.push(msg);
      convo.lastUpdated = Date.now();
      await convo.save();
    } else {
      await Conversation.create({ psid: recipientId, messages: [msg], lastUpdated: Date.now() });
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw new Error('Failed to send message');
  }
};