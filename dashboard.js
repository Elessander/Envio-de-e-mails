require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { ExpressAdapter } = require('@bull-board/express');
const { createBullBoard } = require('@bull-board/api');
const path = require('path');   
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { emailQueue } = require('./queue');

const app = express();
const serverAdapter = new ExpressAdapter();

app.use(express.static(path.join(__dirname, 'static')))

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

app.get('/accept', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).send('Parâmetro email é obrigatório.');

  const now = new Date();
  const timestamp = now.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour12: false
  });

  const line = `${timestamp} - ${email}\n`;
  fs.appendFile('acceptsEmails.txt', line, err => {
    if (err) console.error(err);
  });

  res.sendFile(path.join(__dirname, 'static', 'site.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Dashboard em http://localhost:${PORT}/admin/queues`);
});
