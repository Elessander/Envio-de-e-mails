# Envio de E-mails com BullMQ e SMTP 

Um sistema leve para envio de newsletters promocionais, com gerenciamento de fila, tentativas automáticas (retries) e registro de cliques de aceite.

## Pré-requisitos

* **Node.js** (v16 ou superior) e **npm**
* **Redis** 
* Conta **Gmail** com App Password(Opicional) configurada com autenticação de dois fatores

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
   GMAIL_PASS=Pode ser sua senha ou a senha do app do Gmail
   BASE_URL=http://localhost:3000   
   ```

## Como iniciar o projeto

Abra **três** terminais separados:

1. **Dashboard + Rota de Aceite**

   ```bash
   node dashboard.js
   ```

   Acesse: [http://localhost:3000/admin/queues](http://localhost:3000/admin/queues)

2. **Worker (Envio de E-mail)**

   ```bash
   node worker.js
   ```

3. **Producer (Enfileirar Jobs)**

   ```bash
   node producer.js
   ```
