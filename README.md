# API Delivery 🚀

Este projeto é uma API para gerenciamento de entregas, desenvolvida com Node.js, Express, TypeScript e Prisma ORM.

## 📌 Tecnologias Utilizadas

- **Node.js** + **Express**: Framework backend.
- **TypeScript**: Tipagem estática para maior segurança no código.
- **Prisma ORM**: Gerenciamento eficiente do banco de dados.
- **JWT**: Autenticação segura.
- **Zod**: Validação de dados.
- **Jest + Supertest**: Testes automatizados.
- **Docker**: Para gerenciamento de ambiente.

## 🚀 Como Rodar o Projeto

### 📦 Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/) (caso não use Docker)

### 🔧 Configuração do Ambiente

1. Clone o repositório:

   ```sh
   git clone https://github.com/seu-usuario/apidelivery.git
   cd apidelivery
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

   Instale também as dependências de desenvolvimento:

   ```sh
   npm install --save-dev @types/bcrypt @types/express @types/jest @types/jsonwebtoken @types/node @types/supertest jest prisma supertest ts-jest ts-node tsx typescript
   ```

3. Configure o banco de dados no arquivo `.env`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/apidelivery"
   JWT_SECRET="sua_chave_secreta"
   ```

4. Execute as migrações do Prisma:

   ```sh
   npx prisma migrate dev
   ```

5. Inicie o servidor:

   ```sh
   npm run dev
   ```

## 🧪 Testes

Para rodar os testes automatizados:

```sh
npm run test:dev
```

## 📂 Estrutura do Projeto

```
📦 apidelivery
├── 📂 prisma            # Configuração do Prisma ORM
├── 📂 src               # Código-fonte
│   ├── 📂 configs       # Configurações gerais
│   ├── 📂 controllers   # Lógica dos endpoints
│   ├── 📂 database      # Conexão com o banco
│   ├── 📂 middlewares   # Middlewares para validação e autenticação
│   ├── 📂 routes        # Definição das rotas
│   ├── 📂 tests         # Testes automatizados
│   ├── 📂 types         # Tipagens TypeScript
│   ├── 📂 utils         # Funções auxiliares
│   ├── app.ts          # Configuração principal do app
│   ├── env.ts          # Gerenciamento de variáveis de ambiente
│   └── server.ts       # Inicialização do servidor
├── .env                 # Variáveis de ambiente
├── docker-compose.yml   # Configuração do Docker
├── package.json         # Dependências e scripts
└── tsconfig.json        # Configuração do TypeScript
```


