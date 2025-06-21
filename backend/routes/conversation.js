const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const convos = await Conversation.find({ userId: req.user._id }).sort({ lastUpdated: -1 });
  res.json(convos);
});

router.get('/:psid', auth, async (req, res) => {
  const convo = await Conversation.findOne({ userId: req.user._id, psid: req.params.psid });
  if (!convo) return res.status(404).json({ error: 'Not found' });
  res.json(convo);
});

module.exports = router;
