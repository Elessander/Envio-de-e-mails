# Envio de E-mails com BullMQ e SMTP

Um sistema leve para envio de newsletters promocionais, com gerenciamento de fila, tentativas automáticas (retries) e registro de cliques de aceite.

## Tecnologias Utilizadas

* Node.js (v16 ou superior)
* Express
* BullMQ
* Redis
* Nodemailer
* SMTP (Gmail)
* Faker
* Bull-Board (dashboard de filas)
* dotenv
* path
* ioredis
* ngrok (opcional)

## Pré-requisitos

* **Node.js** (v16 ou superior) e **npm**
* **Redis**
* Conta **Gmail** com App Password (autenticação de dois fatores)
* (Opcional) **ngrok** para expor seu servidor local

## 🚀 Instalação

1. **Clone o repositório**

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <PASTA_DO_PROJETO>
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Crie o arquivo `.env`** na raiz do projeto:

   ```env
   GMAIL_USER=seu.email@gmail.com
   GMAIL_PASS=sua_senha_ou_app_password
   BASE_URL=http://localhost:3000
   ```

## 🛠 Expondo local com ngrok (opcional)

Se quiser receber cliques de qualquer lugar, use o ngrok para criar um túnel público:

1. **Instale o ngrok** (se ainda não tiver)

   ```bash
   npm install -g ngrok
   ```

2. **(Opcional) Configure seu Authtoken**

   ```bash
   ngrok authtoken SEU_AUTH_TOKEN
   ```

3. **Inicie o túnel**

   ```bash
   ngrok http 3000
   ```

   Copie a URL HTTPS gerada (ex: `https://abcd1234.ngrok.io`).

4. **Atualize o `.env`**

   ```diff
   - BASE_URL=http://localhost:3000
   + BASE_URL=https://seusite.ngrok.io
   ```

   e salve.

5. **Reinicie o servidor** para aplicar as mudanças.

---

## Como iniciar o projeto

Abra **três** terminais separados:

1. **Dashboard + Rota de Aceite**

   ```bash
   node dashboard.js
   ```

   Acesse:

   * Local: `http://localhost:3000/admin/queues`
   * Ngrok: `https://seusite.ngrok.io/admin/queues`

2. **Worker (Envio de E-mail)**

   ```bash
   node worker.js
   ```

3. **Producer (Enfileirar Jobs)**

   ```bash
   node producer.js
   ```

---

## Funcionalidades

* Envio de até 300 e-mails em fila
* Retries automáticos em caso de falha
* Remetentes fixos ou aleatórios (via Faker)
* Registro de cliques de aceite em `acceptsEmails.txt`
* Redirecionamento automático para uma página html após o clique
