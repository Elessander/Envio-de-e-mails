require('dotenv').config();
const { emailQueue } = require('./queue');
const { faker } = require('@faker-js/faker');

async function addJobs() {
  // 4 e‐mails reais para teste
  const realEmails = [
    'deathstorm751@gmail.com',
    'elessanderribovski722@gmail.com',
    'elessander.ribovski@aluno.unc.br',
    'elessander.ribovski@estudante.sesisenai.org.br',
  ];

  for (const to of realEmails) {
    await emailQueue.add('sendEmail', {
      to,
      subject: 'Testando!'
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 }
    });
  }

  // mais 296 aleatórios
//   for (let i = 0; i < 296; i++) {
//     await emailQueue.add('sendEmail', {
//       to: faker.internet.email(),
//       subject: faker.lorem.sentence()
//     }, {
//       attempts: 3,
//       backoff: { type: 'exponential', delay: 3000 }
//     });
//   }

  console.log('Jobs adicionados à fila');
  await emailQueue.close();
  process.exit(0);
}

addJobs();
