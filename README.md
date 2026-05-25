# 🌊 Wedding Pass — Sistema de Gestão e Check-in de Convidados

O **Wedding Pass** é uma aplicação completa voltada para o gerenciamento de eventos e controle de presença em tempo real. O sistema conta com uma API robusta no Back-end e uma interface moderna e responsiva utilizando o efeito *Glassmorphic* no Front-end. (a ser aplicado...)

---

## 🚀 Tecnologias Utilizadas

### Back-end
* **Node.js** com **TypeScript**
* **Prisma ORM** (Banco de dados SQLite/PostgreSQL)
* **BCryptJS** (Criptografia de senhas)
* **JsonWebToken** (criação de token para usuário)
* **Zod** (validação de campos)
* **Express** (framework para node.js)
* **CORS** (segurança de requisições)

---

## 🛠️ Como Rodar o Projeto

### Configurando o Back-end

Olhe o arquivo exemplo.env para saber as variáveis de ambiente

Abra o terminal na pasta do Back-end:

```bash
# Entrar na pasta do backend (ajuste o caminho se necessário)
cd backend

# Instalar as dependências do projeto
npm install

# Executar as migrações do banco de dados (Prisma)
npx prisma migrate dev

# POPULAR O BANCO (Rodar o arquivo de Seed automático com 30 convidados e usuários)
npx prisma db seed

# Iniciar o servidor de desenvolvimento
npx tsx src/servidor.ts
```
## 🔑 Credenciais de Acesso (Geradas pelo Seed)

### Acessos e Permissões

Somente o admin@weddingpass.com (senha: 123456) pode acessar rotas com permissões de ADMINISTRADOR. 
Como ainda não desenvolvi um frontend, peço que use o thunderclient (extensão do vsCode) para
gerar um token e, após configurá-lo no seu ThunderClient, utilizá-lo nas requisições para testar as rotas, caso queira.
