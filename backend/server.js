const app = require('./app');
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = 'richpanel_secret_123'; // 🔐 Make sure this matches Facebook input

// ✅ GET: Webhook verification
// app.get('/webhook', (req, res) => {
//   const mode = req.query['hub.mode'];
//   const token = req.query['hub.verify_token'];
//   const challenge = req.query['hub.challenge'];

//   if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//     console.log('✅ Webhook verified successfully.');
//     res.status(200).send(challenge);
//   } else {
//     console.log('❌ Webhook verification failed.');
//     res.sendStatus(403);
//   }
// });

// app.post('/webhook', (req, res) => {
//   console.log('✅ POST /webhook hit');
//   console.log(JSON.stringify(req.body, null, 2));
//   res.status(200).send('EVENT_RECEIVED');
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
