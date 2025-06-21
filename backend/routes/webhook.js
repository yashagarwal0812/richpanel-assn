const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const FacebookConnection = require('../models/FacebookConnection');
const axios = require('axios');

router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  res.sendStatus(403);
});

router.post('/', async (req, res) => {
  const { object, entry } = req.body;
  if (object !== 'page') return res.sendStatus(404);

  for (const e of entry) {
    const pageId = e.id;
    const messages = e.messaging;

    const fbConn = await FacebookConnection.findOne({ pageId });
    if (!fbConn) continue;

    const userId = fbConn.userId;

    for (const m of messages) {
      const psid = m.sender.id;
      const text = m.message?.text;
      if (!text) continue;

      const msg = { direction: 'inbound', text, timestamp: m.timestamp };
      const convo = await Conversation.findOne({ userId, pageId, psid });

      if (convo) {
        convo.messages.push(msg);
        convo.lastUpdated = m.timestamp;
        await convo.save();
      } else {
        await Conversation.create({ userId, pageId, psid, messages: [msg], lastUpdated: m.timestamp });
      }
    }
  }

  res.sendStatus(200);
});

module.exports = router;
