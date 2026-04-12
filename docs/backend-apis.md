# APIs e Web Services

O MedHub é uma plataforma de agendamento médico que conecta pacientes e profissionais de saúde de forma simples, prática e organizada. A solução permite que médicos se cadastrem e disponibilizem horários de atendimento, enquanto pacientes podem consultar essas informações e realizar agendamentos.

O sistema é estruturado em uma arquitetura distribuída, na qual cada componente possui responsabilidades bem definidas: interface com o usuário, processamento das regras de negócio e armazenamento dos dados. A comunicação entre a interface web e o banco de dados é realizada por meio de API, assegurando o armazenamento e o gerenciamento seguro de todas as informações.

O objetivo do MedHub é otimizar o processo de agendamento, contribuindo para a satisfação do usuário e proporcionando uma gestão mais eficiente das agendas dos profissionais de saúde.

## Objetivos da API

A API do MedHub tem como objetivo centralizar e controlar toda a comunicação entre as aplicações clientes web e mobile, além do banco de dados, sendo o único ponto de entrada para os dados do sistema. A API deve atender exclusivamente os frontends do próprio MedHub (React e React Native), não sendo exposta a clientes externos.

**Os recursos que a API deve fornecer são:**

- **Autenticação e autorização** de usuários (pacientes, médicos e recepcionistas) via JWT, garantindo acesso seguro e controlado por perfil.
- **Gestão de usuários**, incluindo cadastro e login, com validação de CPF e e-mail únicos.
- **Gestão de médicos**, permitindo o cadastro de profissionais com especialidade e CRM e sua vinculação a clínicas.
- **Gestão de agendamentos**, permitindo que pacientes agendem, visualizem e cancelem consultas, com prevenção de conflitos de horário.
- **Notificações**, disparando alertas aos usuários em criações, confirmações, alterações e cancelamentos de consultas, via push (Expo) e e-mail.


## Modelagem da Aplicação

O sistema é estruturado em 5 entidades: **USER**, **DOCTOR**, **CLINIC**, **APPOINTMENT** e **NOTIFICATION**.

**USER** é o centro do modelo, representando tanto pacientes quanto médicos pelo campo `role`. **DOCTOR** estende USER com dados profissionais e pode ser vinculado a uma **CLINIC**, que agrupa múltiplos médicos.

**APPOINTMENT** conecta um paciente a um médico, registrando data, status e notas. Cada agendamento pode gerar múltiplas **NOTIFICATION**, que também podem ser enviadas de forma independente diretamente ao usuário.

![Modelo de Entidade e Relacionamento](img/diagrama-de-modelagem.drawio.png)

## Tecnologias Utilizadas

A seguir, as tecnologias definidas para serem utilizadas no desenvolvimento do projeto.

| Camada          | Tecnologias                                                              |
| --------------- | ------------------------------------------------------------------------ |
| Backend         | Node.js · Express.js · TypeScript · Prisma ORM · JWT · Zod · Nodemailer  |
| Banco de dados  | PostgreSQL                                                               |
| Frontend Web    | React · Vite · TypeScript · React Router · Axios · Tailwind CSS          |
| Frontend Mobile | React Native · Expo · TypeScript · Expo Router · Expo Push Notifications |

## API Endpoints

A seguir, todos os endpoints disponíveis na aplicação, organizados por módulo. Endpoints marcados com **[JWT]** exigem o cabeçalho `Authorization: Bearer <token>`.

---

### Autenticação (`/auth`)

#### Endpoint 01: `POST /auth/register` — Criar Usuário

Cria um novo usuário. Se a `role` for `DOCTOR`, o registro do médico associado também é criado automaticamente.

**Body (JSON):**

```json
{
  "name": "string (obrigatório)",
  "email": "string (formato de e-mail, obrigatório)",
  "cpf": "string (mínimo 11 caracteres, obrigatório)",
  "password": "string (mínimo 6 caracteres, obrigatório)",
  "role": "PATIENT | DOCTOR | RECEPTIONIST",
  "specialty": "string (obrigatório se role = DOCTOR)",
  "crm": "string (obrigatório se role = DOCTOR)"
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

`400 Bad Request` — Dados inválidos ou e-mail/CPF já cadastrado

```json
{
  "error": "E-mail ou CPF já cadastrado"
}
```

---

#### Endpoint 02: `POST /auth/login` — Autenticar Usuário

Valida as credenciais do usuário e retorna um token JWT de acesso.

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
  "token": "string (JWT)",
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

---

### Agendamentos (`/appointments`)

#### Endpoint 03: `POST /appointments/createAppointment` — Criar Agendamento

Cria um novo agendamento entre um paciente e um médico. Valida que a data é futura, que o paciente existe e que o médico existe.

**Body (JSON):**

```json
{
  "patientId": "string (UUID)",
  "doctorId": "string (UUID)",
  "date": "string (ISO 8601, ex: 2026-05-10T14:00:00Z)",
  "notes": "string (opcional)"
}
```

**Respostas:**

`201 Created` — Agendamento criado com sucesso

```json
{
  "id": "string (UUID)",
  "patientId": "string (UUID)",
  "doctorId": "string (UUID)",
  "date": "string (ISO 8601)",
  "status": "PENDING",
  "notes": "string | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

`400 Bad Request` — Dados inválidos ou regra de negócio violada

```json
{
  "error": "A data da consulta deve ser no futuro."
}
```

```json
{
  "error": "Paciente não encontrado. Use um patientId válido."
}
```

```json
{
  "error": "Médico não encontrado. Use um doctorId válido."
}
```

---

#### Endpoint 04: `GET /appointments/listAppointments` — Listar Agendamentos do Usuário

Retorna todos os agendamentos associados ao usuário informado (como paciente ou médico).

**Body (JSON):**

```json
{
  "userId": "string (UUID)"
}
```

**Respostas:**

`200 OK` — Lista de agendamentos

```json
[
  {
    "id": "string (UUID)",
    "patientId": "string (UUID)",
    "doctorId": "string (UUID)",
    "date": "string (ISO 8601)",
    "status": "PENDING | CONFIRMED | CANCELLED | RESCHEDULED",
    "notes": "string | null",
    "createdAt": "string (ISO 8601)"
  }
]
```

`400 Bad Request` — UUID inválido

```json
{
  "error": [{ "message": "Invalid uuid" }]
}
```

---

#### Endpoint 05: `POST /appointments/cancelAppointment` — Cancelar Agendamento

Cancela um agendamento existente, alterando seu status para `CANCELLED`.

**Body (JSON):**

```json
{
  "appointmentId": "string (UUID)"
}
```

**Respostas:**

`200 OK` — Agendamento cancelado com sucesso

```json
{
  "id": "string (UUID)",
  "status": "CANCELLED",
  "updatedAt": "string (ISO 8601)"
}
```

`400 Bad Request` — UUID inválido ou agendamento não encontrado

```json
{
  "error": "Consulta não encontrada."
}
```

---

### Notificações (`/notifications`) [JWT]

Todos os endpoints abaixo exigem autenticação via `Authorization: Bearer <token>`.

#### Endpoint 06: `GET /notifications` — Listar Notificações

Retorna as notificações do usuário autenticado, com suporte a paginação e filtro de lidas/não lidas.

**Query params:**

| Parâmetro    | Tipo    | Padrão | Descrição                                 |
| :----------- | :------ | :----- | :---------------------------------------- |
| `page`       | number  | `1`    | Número da página (inteiro positivo)       |
| `limit`      | number  | `20`   | Itens por página (entre 1 e 50)           |
| `unreadOnly` | boolean | —      | `true` para retornar apenas não lidas     |

**Resposta `200 OK`:**

```json
{
  "data": [
    {
      "id": "string (UUID)",
      "type": "APPOINTMENT_CREATED | APPOINTMENT_CONFIRMED | APPOINTMENT_CANCELLED | APPOINTMENT_RESCHEDULED",
      "title": "string",
      "message": "string",
      "read": false,
      "appointmentId": "string (UUID) | null",
      "createdAt": "string (ISO 8601)"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

---

#### Endpoint 07: `GET /notifications/unread-count` — Contagem de Não Lidas

Retorna o total de notificações não lidas do usuário autenticado.

**Resposta `200 OK`:**

```json
{
  "count": 3
}
```

---

#### Endpoint 08: `PATCH /notifications/read-all` — Marcar Todas como Lidas

Marca todas as notificações do usuário autenticado como lidas.

**Resposta `204 No Content`** — Operação realizada com sucesso (sem corpo de resposta).

---

#### Endpoint 09: `PATCH /notifications/:id/read` — Marcar Notificação como Lida

Marca uma notificação específica do usuário autenticado como lida.

**Parâmetro de rota:** `:id` — UUID da notificação.

**Respostas:**

`200 OK` — Notificação marcada como lida

```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "type": "APPOINTMENT_CREATED | APPOINTMENT_CONFIRMED | APPOINTMENT_CANCELLED | APPOINTMENT_RESCHEDULED",
  "title": "string",
  "message": "string",
  "read": true,
  "appointmentId": "string (UUID) | null",
  "createdAt": "string (ISO 8601)"
}
```

`404 Not Found` — Notificação não encontrada ou não pertence ao usuário

```json
{
  "error": "Notificação não encontrada."
}
```

---

#### Endpoint 10: `POST /notifications/send` — Enviar Notificação

Envia uma notificação a um usuário. Pacientes só podem enviar notificações para si mesmos; médicos e recepcionistas podem notificar qualquer usuário. O sistema aciona o envio simultâneo por push (Expo) e por e-mail (Nodemailer).

**Perfis autorizados:** `PATIENT`, `DOCTOR`, `RECEPTIONIST`

**Body (JSON):**

```json
{
  "userId": "string (UUID — destinatário)",
  "type": "APPOINTMENT_CREATED | APPOINTMENT_CONFIRMED | APPOINTMENT_CANCELLED | APPOINTMENT_RESCHEDULED",
  "title": "string",
  "message": "string",
  "emailSubject": "string",
  "emailHtml": "string (HTML do corpo do e-mail)",
  "appointmentId": "string (UUID, opcional)"
}
```

**Respostas:**

`201 Created` — Notificação enviada com sucesso

```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "type": "string",
  "title": "string",
  "read": false,
  "createdAt": "string (ISO 8601)"
}
```

`403 Forbidden` — Paciente tentando enviar para outro usuário

```json
{
  "error": "Pacientes só podem enviar notificações para si mesmos."
}
```

`404 Not Found` — Usuário destinatário não encontrado

```json
{
  "error": "Usuário destinatário não encontrado."
}
```

---

### Usuários (`/users`) [JWT]

#### Endpoint 11: `PATCH /users/me/push-token` — Atualizar Token Push

Registra ou atualiza o token Expo Push do dispositivo do usuário autenticado, habilitando o recebimento de notificações push no aplicativo mobile.

**Body (JSON):**

```json
{
  "expoPushToken": "string (ex: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx])"
}
```

**Respostas:**

`200 OK` — Token atualizado com sucesso

```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "expoPushToken": "string"
}
```

`401 Unauthorized` — Token JWT inválido ou usuário não encontrado

```json
{
  "error": "Usuário não encontrado."
}
```

---

### Saúde da API

#### Endpoint 12: `GET /health` — Verificar Status

Verifica se a API está operacional. Utilizado por load balancers e ferramentas de monitoramento.

**Resposta `200 OK`:**

```json
{
  "status": "ok"
}
```

## Considerações de Segurança

- **Senhas:** As senhas nunca são armazenadas em texto puro. O bcrypt é utilizado para gerar um hash seguro com 10 rounds de salt antes de persistir no banco de dados.
- **Autenticação:** Todos os endpoints protegidos exigem um token JWT válido, passado no cabeçalho `Authorization: Bearer <token>`. O token é verificado pelo middleware `authenticate` antes de qualquer lógica de negócio.
- **Autorização por perfil:** O middleware `authorize` restringe o acesso a determinados endpoints com base na `role` do usuário (`PATIENT`, `DOCTOR`, `RECEPTIONIST`), impedindo que perfis sem permissão acessem recursos restritos.
- **Unicidade de cadastro:** O banco de dados garante um único registro por CPF e por e-mail através de constraints `@unique` no schema do Prisma, evitando duplicidade de contas.
- **Validação de entrada:** Todos os dados recebidos pela API são validados com Zod antes de serem processados, rejeitando requisições malformadas com `400 Bad Request` antes de qualquer acesso ao banco.
- **Variáveis de ambiente:** Credenciais sensíveis (JWT secret, senha do banco, credenciais SMTP) são gerenciadas exclusivamente por variáveis de ambiente, nunca expostas no código-fonte.

## Implantação

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

### 1. Instalar dependências

```bash
cd src/backend
npm install
```

---

### 2. Configurar variáveis de ambiente

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

### 3. Subir o banco com Docker

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

### 4. Executar as migrations

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

### 5. (Opcional) Inspecionar o banco com Prisma Studio

```bash
npx prisma studio
```

Acesse em `http://localhost:5555` e verifique se as tabelas `User`, `Doctor`, `Clinic`, `Appointment` e `Notification` foram criadas.

---

### 6. Iniciar o servidor

```bash
npm run dev
```

Saída esperada:

```json
{"level":"info","ts":"...","message":"MedHub API iniciada","meta":{"port":3000,"env":"development"}}
```

---

### 7. Verificar que está funcionando

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
| API's de Agendamento, Listagem e Cancelamento de Consultas (RF-001) | [Cenários de Teste — Agendamento, Listagem e Cancelamento de Consultas](rf-001-appointments/cenarios-de-teste.md) |
| API de Notificações (RF-006) | [Cenários de Teste — Notificações](rf-006-notifications/cenarios-de-teste.md) |
| API de Autenticação (RF-005) | [Cenários de Teste — Autenticação](rf-005-auth/cenarios-de-teste.md)          |
| API de Clínicas (RF-007)     | [Cenários de Teste - Clínicas](rf-007-clinics/testes-clinicas.md)             |

# Referências

[Referências utilizadas no projeto](./referencia.md)
