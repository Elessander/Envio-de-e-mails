require('dotenv').config();
const { Worker } = require('bullmq');
const { connection } = require('./queue');
const transporter = require('./mailer');
const { faker } = require('@faker-js/faker');
const path = require('path');

const BASE_URL = process.env.BASE_URL;

const worker = new Worker('emailQueue', async job => {
  const { to, subject } = job.data;

  const from = process.env.FROM_FIXED || faker.internet.email();
  const link = `${BASE_URL}/accept?email=${encodeURIComponent(to)}`;

  console.log(`[Tentativa ${job.attemptsMade + 1}/${job.opts.attempts}] Enviando para ${to}`);

  const html = `
      <h2>Olá, ${to.split('@')[0]}!</h2>
      <p>
        Nós acreditamos que cada passo de dança conta uma história.
        É com muita alegria que compartilhamos esse momento especial com você:
        um clique vai te levar ao vídeo completo de umas de nossas performaces.
      </p>

      <img
        src="cid:foto-danca"
        alt=""
        style="display:block; max-width:100%; height:auto; margin:20px auto;"
      />

      <p>
        Quando a batida toca, não tem como ficar parado! Prepare-se para se inspirar
        com cada movimento e, se gostar, compartilhe com quem também ama dançar.
      </p>

      <p style="text-align:center; margin:30px 0;">
        <a
          href="${link}"
          style="
            display:inline-block;
            padding:15px 30px;
            background-color:#007bff;
            color:#ffffff;
            text-decoration:none;
            border-radius:6px;
            font-size:16px;
            font-weight:bold;
          "
        >
          Clique aqui para ver uma coisa surpreendente!
        </a>
      </p>

      <p>Atenciosamente,<br/>Um cara ai</p>
    `;

    const text = `Olá! Veja o vídeo completo da dança aqui: ${link}`;

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
      attachments: [
        {
          filename: 'bonasorrindo.jpg',
          path: path.resolve(__dirname, 'assets/bonasorrindo.jpg'),
          cid: 'foto-danca'
        }
      ]
    });

  console.log(`E-mail enviado para: ${to}`);
}, { connection });

worker.on('completed', job => console.log(`Job ${job.id} concluído`));
worker.on('failed', (job, err) => console.log(`Job ${job.id} falhou: ${err.message}`));
