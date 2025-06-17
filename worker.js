require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Worker } = require('bullmq');
const transporter = require('./mailer');
const { connection } = require('./queue');
const { faker } = require('@faker-js/faker');

const BASE_URL = process.env.BASE_URL;

const worker = new Worker('emailQueue', async job => {
  const { to, subject } = job.data;

  const from = process.env.FROM_FIXED || faker.internet.email();
  const raw = to.split('@')[0].split(/[._]/)[0];
  const name  = raw.charAt(0).toUpperCase() + raw.slice(1);

  const link = `${BASE_URL}/accept?email=${encodeURIComponent(to)}`;

  console.log(`[Tentativa ${job.attemptsMade + 1}/${job.opts.attempts}] Enviando para ${to}`);

  let html = fs.readFileSync(
    path.join(__dirname, 'static', 'corpoEmail.html'),
    'utf-8'
  );

  html = html
    .replace(/{{name}}/g, name)
    .replace(/{{link}}/g, link);

  const text = `Olá, ${name}! Veja o vídeo completo da dança aqui: ${link}`;

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
    attachments: [
      {
        filename: 'imagem.jpg',
        path: path.resolve(__dirname, 'static/assets/imagem.jpg'),
        cid: 'foto-danca'
      }
    ]
  });

  console.log(`E-mail enviado para: ${to}`);
}, { connection });

worker.on('completed', job => console.log(`Job ${job.id} concluído`));
worker.on('failed', (job, err) => console.log(`Job ${job.id} falhou: ${err.message}`));
