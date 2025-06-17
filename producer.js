require('dotenv').config();
const { emailQueue } = require('./queue');
const { faker } = require('@faker-js/faker');

async function addJobs() {
  // E‐mails reais para teste
  const realEmails = [
    'deathstorm751@gmail.com'
  ];

  for (const to of realEmails) {
    await emailQueue.add('sendEmail', {
      to,
      subject: 'Testando1!'
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 }
    });
  }

  // mais 296 aleatórios
  for (let i = 0; i < 3; i++) {
    await emailQueue.add('sendEmail', {
      to: faker.internet.email(),
      subject: faker.lorem.sentence()
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 }
    });
  }

  console.log('Jobs adicionados à fila');
  await emailQueue.close();
  process.exit(0);
}

addJobs();
