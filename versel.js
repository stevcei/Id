const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ces valeurs sont récupérées depuis les variables d'environnement Vercel
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '7665929910:AAGejxbAgfw2a0oHpjJyzZC6XCXejFTkefI';
const CHAT_ID = process.env.CHAT_ID || '7736182876';

app.post('/submit', async (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).send('Tous les champs sont obligatoires.');
  }

  const text = `📩 *Nouveau formulaire reçu*\n👤 Nom: ${nom}\n📧 Email: ${email}\n📝 Message: ${message}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) throw new Error('Erreur Telegram');

    res.status(200).send('✅ Message envoyé à Telegram !');
  } catch (error) {
    console.error('Erreur Telegram:', error);
    res.status(500).send('❌ Erreur lors de l’envoi à Telegram.');
  }
});

module.exports.handler = serverless(app);
