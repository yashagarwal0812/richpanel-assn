const Conversation = require('../models/Conversation');

exports.handleMessage = async (req, res) => {
  const body = req.body;
  if (body.object === 'page') {
    for (let entry of body.entry) {
      for (let messagingEvent of entry.messaging) {
        const senderId = messagingEvent.sender.id;
        const message = messagingEvent.message.text;
        
        // Store to DB
        await Conversation.create({
          customerId: senderId,
          message,
          timestamp: Date.now(),
        });
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
