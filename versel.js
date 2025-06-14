const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post('/submit', async (req, res) => {
  const { nom, email, message } = req.body;

  const text = `📩 *Formulaire reçu :*\n👤 ${nom}\n📧 ${email}\n📝 ${message}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });

    res.send('Message envoyé à Telegram !');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur Telegram');
  }
});

module.exports.handler = serverless(app);