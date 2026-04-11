# APIs e Web Services

O MedHub é uma plataforma de agendamento médico que conecta pacientes e profissionais de saúde de forma simples, prática e organizada. A solução permite que médicos se cadastrem e disponibilizem horários de atendimento, enquanto pacientes podem consultar essas informações e realizar agendamentos.

O sistema é estruturado em uma arquitetura distribuída, na qual cada componente possui responsabilidades bem definidas: interface com o usuário, processamento das regras de negócio e armazenamento dos dados. A comunicação entre a interface web e o banco de dados é realizada por meio de API, assegurando o armazenamento e o gerenciamento seguro de todas as informações.
O objetivo do MedHub é otimizar o processo de agendamento, contribuindo para a satisfação do usuário e proporcionando uma gestão mais eficiente das agendas dos profissionais de saúde.

## Objetivos da API

A API do MedHub tem como objetivo centralizar e controlar toda a comunicação entre as aplicações clientes web e mobile, além do banco de dados, sendo o único ponto de entrada para os dados do sistema. A API deve atender exclusivamente os frontends do próprio MedHub (React e React Native), não sendo exposta a clientes externos.

**Os recursos que a API deve fornecer são:**

- **Autenticação e autorização** de usuários (pacientes, médicos e recepcionistas) via JWT, garantindo acesso seguro e controlado por perfil.
- **Gestão de usuários**, incluindo cadastro, login e recuperação de senha, com validação de CPF e e-mail únicos.
- **Gestão de médicos e clínicas**, permitindo cadastro, atualização e vinculação de profissionais a clínicas.
- **Gestão de serviços e horários**, permitindo que médicos cadastrem os serviços oferecidos e disponibilizem horários de atendimento.
- **Gestão de agendamentos**, permitindo que pacientes agendem, visualizem e cancelem consultas, com prevenção de conflitos de horário.
- **Notificações**, disparando alertas aos usuários em confirmações, alterações e cancelamentos de consultas.


## Modelagem da Aplicação
[Descreva a modelagem da aplicação, incluindo a estrutura de dados, diagramas de classes ou entidades, e outras representações visuais relevantes.]


## Tecnologias Utilizadas

A seguir, as tecnologias definidas para serem utilizadas no desenvolvimento do projeto.

| Camada          | Tecnologias                                                              |
| --------------- | ------------------------------------------------------------------------ |
| Backend         | Node.js · Express.js · TypeScript · Prisma ORM · JWT · Zod · Nodemailer  |
| Banco de dados  | PostgreSQL                                                               |
| Frontend Web    | React · Vite · TypeScript · React Router · Axios · Tailwind CSS          |
| Frontend Mobile | React Native · Expo · TypeScript · Expo Router · Expo Push Notifications |

## API Endpoints

A seguir, os principais endpoints disponíveis na aplicação.

### Endpoint 01: `POST /register` — Criar Usuário
 
Cria um novo usuário. Se a role for `DOCTOR`, cria também o registro do médico associado.
 
**Body (JSON):**
 
```json
{
  "name": "string",
  "email": "string (formato de e-mail)",
  "cpf": "string (11 caracteres)",
  "password": "string (mínimo 6 caracteres)",
  "role": "PATIENT | DOCTOR | RECEPTIONIST",
  "specialty": "string (obrigatório se role for DOCTOR)",
  "crm": "string (obrigatório se role for DOCTOR)"
}
```
 
**Respostas:**
 
`201 Created` — Usuário criado com sucesso
 
```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "role": "PATIENT | DOCTOR | RECEPTIONIST"
}
```
 
`400 Bad Request` — Erro de validação Zod ou regra de negócio (e-mail/CPF duplicado)
 
```json
{
  "error": "E-mail ou CPF já cadastrado"
}
```
 
---
 
### Endpoint 02: `POST /login` — Autenticar Usuário
 
Valida as credenciais do usuário e retorna um token de acesso (JWT).
 
**Body (JSON):**
 
```json
{
  "email": "string (formato de e-mail)",
  "password": "string"
}
```
 
**Respostas:**
 
`200 OK` — Login realizado com sucesso
 
```json
{
  "token": "string (JWT Token)",
  "user": {
    "id": "string (UUID)",
    "name": "string",
    "role": "PATIENT | DOCTOR | RECEPTIONIST"
  }
}
```
 
`401 Unauthorized` — Credenciais inválidas
 
```json
{
  "error": "Credenciais inválidas"
}
```

## Considerações de Segurança

- **Senhas:** As senhas nunca são armazenadas em texto puro. O bcrypt é utilizado para gerar um hash seguro com 10 rounds antes de salvar no banco.
- **Unicidade:** O banco garante um único cadastro por CPF e por e-mail através de constraints @unique no schema do Prisma.

## Implantação

## Implementação

### Hospedagem

A plataforma será hospedada na **Amazon Web Services (AWS)** em dois ambientes distintos:

- **Desenvolvimento:** executado localmente com Docker Compose, subindo instâncias locais do PostgreSQL e da API para agilizar o ciclo de desenvolvimento e testes.
- **Produção:** cada componente é implantado em um serviço AWS dedicado, conforme a tabela abaixo.

| Componente                  | Serviço AWS                     | Justificativa                                                                                                                            |
| :-------------------------- | :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (API Node.js)       | AWS EC2                         | Instância para execução do servidor Node.js, permitindo configuração direta do ambiente, variáveis e regras de rede via Security Groups. |
| Banco de dados (PostgreSQL) | AWS RDS (PostgreSQL)            | Banco de dados relacional gerenciado, isolado do servidor de aplicação, reforçando a separação de camadas da arquitetura distribuída.    |
| Frontend Web (React/Vite)   | AWS S3 + CloudFront             | O build estático da SPA é hospedado no S3 e distribuído via CloudFront, sem necessidade de servidor dedicado para o frontend.            |
| Frontend Mobile (Expo)      | Expo Application Services (EAS) | Build e geração dos pacotes para Android (APK/AAB) e iOS (IPA), com distribuição via Google Play e App Store em produção.                |

---

### Pré-requisitos

| Ferramenta     | Versão mínima | Como verificar           |
| :------------- | :------------ | :----------------------- |
| Node.js        | 22.x LTS      | `node -v`                |
| npm            | 9+            | `npm -v`                 |
| Docker         | 24+           | `docker -v`              |
| Docker Compose | v2 (plugin)   | `docker compose version` |
| VS Code        | qualquer      | —                        |

> **Nota sobre Node.js:** Para gerenciar versões, use nvm: `nvm install 22 && nvm use 22`

---

### 1. Extensões recomendadas (VS Code)

O repositório inclui `.vscode/extensions.json` com as extensões do projeto. Ao abrir a pasta no VS Code, ele vai sugerir instalá-las automaticamente. Caso não apareça a notificação, instale manualmente:

| Extensão                     | Função                                                 |
| :--------------------------- | :----------------------------------------------------- |
| `Prisma.prisma`              | Syntax highlight e format do `schema.prisma`           |
| `dbaeumer.vscode-eslint`     | Mostra erros de lint inline e corrige ao salvar        |
| `esbenp.prettier-vscode`     | Formata TypeScript, JS e JSON ao salvar                |
| `usernamehw.errorlens`       | Exibe mensagens de erro diretamente na linha do código |
| `yoavbls.pretty-ts-errors`   | Torna os erros TypeScript legíveis                     |
| `yzhang.markdown-all-in-one` | Preview e formatação de Markdown                       |

> Com essas extensões, lint e formatação rodam automaticamente ao salvar — não é necessário executar `npm run lint` ou `npm run format` manualmente durante o desenvolvimento.

---

### 2. Instalar dependências

```bash
cd src/backend
npm install
```

---

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

O `.env.example` já vem configurado para o banco Docker. Ajuste apenas os valores de JWT e SMTP:

```env
# Banco — já corresponde ao docker-compose.yml, não precisa alterar
DATABASE_URL=postgresql://medhub:medhub@localhost:5432/medhub

# Gere uma string longa e aleatória (ex: openssl rand -hex 32)
JWT_SECRET=troque_por_uma_chave_segura
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development

# SMTP para e-mails — use Mailtrap em desenvolvimento (mailtrap.io)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=seu_usuario_mailtrap
SMTP_PASS=sua_senha_mailtrap
EMAIL_FROM=no-reply@medhub.app
```

---

### 4. Subir o banco com Docker

```bash
docker compose up -d
```

Verifique se o container está rodando:

```bash
docker compose ps
```

Saída esperada:

```bash
NAME         STATUS           PORTS
medhub-db    Up X seconds     0.0.0.0:5432->5432/tcp
```

> Para parar o banco sem perder os dados: `docker compose stop`  
> Para remover o container e os dados: `docker compose down -v`

---

### 5. Executar as migrations

Cria as tabelas no banco a partir do schema Prisma:

```bash
npx prisma migrate dev --name init
```

Saída esperada:

```bash
Applying migration 20260318000000_init
Your database is now in sync with your schema.
```

---

### 6. (Opcional) Inspecionar o banco com Prisma Studio

```bash
npx prisma studio
```

Acesse em `http://localhost:5555` e verifique se as tabelas `User`, `Doctor`, `Clinic`, `Appointment` e `Notification` foram criadas.

---

### 7. Iniciar o servidor

```bash
npm run dev
```

Saída esperada:

```json
{"level":"info","ts":"...","message":"MedHub API iniciada","meta":{"port":3000,"env":"development"}}
```

---

### 8. Verificar que está funcionando

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{"status":"ok"}
```

### Cenários de teste documentados

| Funcionalidade               | Documento de testes                                                           |
| ---------------------------- | ----------------------------------------------------------------------------- |
| API de Notificações (RF-006) | [Cenários de Teste — Notificações](rf-006-notifications/cenarios-de-teste.md) |
| API de Autenticação (RF-005) | [Cenários de Teste — Autenticação](rf-005-auth/cenarios-de-teste.md)          |

# Referências

['Referências utilizadas no projeto'](./referencia.md) 
