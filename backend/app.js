const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
require('dotenv').config();

const corsOptions = {
  origin: '*', // allow all for testing
  methods: ['GET', 'POST', 'OPTIONS'],
};

app.use(cors(corsOptions));

connectDB();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.get('/ping', (req, res) => res.status(200).send('pong'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/facebook', require('./routes/facebook'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/conversation', require('./routes/conversation'));
app.use('/webhook', require('./routes/webhook'));

module.exports = app;


// curl -G 'https://graph.facebook.com/v16.0/oauth/access_token?grant_type=fb_exchange_token&client_id=1240157864318604&client_secret=e004960f623327d2c3d1a4722666cd12&fb_exchange_token=EAARn6sD31owBOwTRBbWZCGja4MmZAEqGnHPfCRD8ZAgsFxnxsRufv67mD1KuehTZCfzP9U0nmAZByEgomhHr4QBEhCqgn6SOtUzt9arwoKkprLDYHaxdzhZCDHQ39DSNQ0R4ou7ChTdOcCL2IBEBw3gjPQNr0BHQqpsKLqOb4BF1p4OlDfOublj4ZCk0RCg3oo4aVEOw2tAkMnu5ZCDsPFPAqe5N7ONDACQkDNZCVoRHMbT7GKCcZD'
// curl -G 'https://graph.facebook.com/v16.0/me/accounts?access_token=EAARn6sD31owBO6ZCJ6fe8IiERSZAF0Q2bZB12pUAZBFTeyqZB8ysjqVgbFclEd8Tlt5LZBojz5ZB9SJJyioqg5Mk2qzlyPwLCRJVNYX6PddZAUeAG26w1LjOM3CK1Alqsz5QfqNmfP6TjoJMWPJnGTh951i5MZBrHXyTnBIqOCBE8rpTHuXqLZBAes6E96ZAklTkuLQ'