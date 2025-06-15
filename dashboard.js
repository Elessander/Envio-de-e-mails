require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { ExpressAdapter } = require('@bull-board/express');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { emailQueue } = require('./queue');

const app = express();
const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

app.get('/accept', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).send('Parâmetro email é obrigatório.');

  const line = `${new Date().toISOString()} - ${email}\n`;
  fs.appendFile('accepts.txt', line, err => {
    if (err) console.error(err);
  });

  res.send('Aceite registrado! Obrigado.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Dashboard em http://localhost:${PORT}/admin/queues`);
});
