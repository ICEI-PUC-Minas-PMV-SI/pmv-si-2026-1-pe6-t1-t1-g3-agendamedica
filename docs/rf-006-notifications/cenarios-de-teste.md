# Cenários de Teste — API de Notificações (RF-006)

## Contexto

Este documento descreve os cenários de teste para a API de notificações do MedHub, implementada no RF-006. Cada cenário corresponde a um vídeo de demonstração, cobrindo um comportamento isolado da API.

**Base URL:** `http://localhost:3000`

**Autenticação:** todos os endpoints exigem o header:
```
Authorization: Bearer <token>
```

## Ferramentas utilizadas

| Ferramenta        | O que é                                           | Por que usamos                                                                                                                                                                                                      |
| ----------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Postman**       | Cliente HTTP para enviar requisições à API        | Permite executar cada cenário de forma isolada e visualizar as respostas com formatação                                                                                                                             |
| **Prisma Studio** | Interface visual para o banco de dados PostgreSQL | Permite verificar as mudanças persistidas no banco após cada operação — por exemplo, confirmar que `read` passou para `true` após marcar uma notificação como lida                                                  |
| **Mailpit**       | Servidor SMTP local que intercepta e-mails        | Em desenvolvimento, os e-mails não são entregues a destinatários reais — o Mailpit os captura localmente para que possam ser inspecionados sem depender de credenciais SMTP externas nem arriscar envios acidentais |

### Por que o Mailpit é necessário neste contexto

A rota `POST /notifications/send` envia um e-mail via SMTP como parte do fluxo de notificação. Em produção, esse e-mail seria entregue ao endereço do usuário. Em desenvolvimento, usamos o Mailpit para:

- Não depender de uma conta de e-mail real nem de credenciais SMTP externas
- Evitar o envio acidental de e-mails durante os testes
- Inspecionar o HTML renderizado e o assunto do e-mail diretamente em `http://localhost:8025`

O Mailpit age como um servidor SMTP falso — a API acredita que está enviando o e-mail normalmente, mas ele nunca sai da máquina local.

---

## Referência rápida de endpoints

| Método | Rota                        | Descrição                               |
| ------ | --------------------------- | --------------------------------------- |
| POST   | /notifications/send         | Enviar notificação                      |
| GET    | /notifications              | Listar notificações do usuário          |
| GET    | /notifications/unread-count | Contar notificações não lidas           |
| PATCH  | /notifications/:id/read     | Marcar uma notificação como lida        |
| PATCH  | /notifications/read-all     | Marcar todas as notificações como lidas |

---

## Pré-requisitos

Antes de iniciar os cenários, configure o ambiente com dados de teste:

1. Com o banco rodando, execute o seed em `src/backend/`:
   ```
   node scripts/seed.js
   ```
2. O seed imprime os comandos para gerar tokens. Execute o comando para **Paciente 1**:
   ```
   node scripts/gen-token.js <id-de-ana>
   ```
3. Use o token gerado no header `Authorization: Bearer <token>` de todas as requisições.

O seed é idempotente — pode ser re-executado sem duplicar dados.

**Estado inicial criado pelo seed (Paciente 1 — Ana Paciente):**

| ID da notificação                      | Tipo                  | Lida? |
| -------------------------------------- | --------------------- | ----- |
| `00000000-0000-0000-0000-000000000010` | APPOINTMENT_CREATED   | não   |
| `00000000-0000-0000-0000-000000000011` | APPOINTMENT_CONFIRMED | não   |
| `00000000-0000-0000-0000-000000000012` | APPOINTMENT_CANCELLED | sim   |

---

## Cenários de Teste

### Cenário 1 — Enviar notificação com sucesso

**Rota:** `POST /notifications/send`

**Objetivo:** Demonstrar que a API cria a notificação no banco e retorna os dados criados.

#### Requisição

```http
POST /notifications/send HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
Content-Length: 312

{
    "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "type": "APPOINTMENT_CREATED",
    "title": "Consulta agendada",
    "message": "Sua consulta foi agendada para amanhã às 10h.",
    "emailSubject": "MedHub — Consulta agendada",
    "emailHtml": "<p>Sua consulta foi agendada para amanhã às 10h.</p>"
}
```

> Use o `userId` de **Ana Paciente** impresso pelo seed.

#### Resposta esperada — `201 Created`

```json
{
    "id": "b9e600b7-652c-4a2a-97c6-2e40eaae198f",
    "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "type": "APPOINTMENT_CREATED",
    "title": "Consulta agendada",
    "message": "Sua consulta foi agendada para amanhã às 10h.",
    "appointmentId": null,
    "read": false,
    "createdAt": "2026-04-09T21:47:35.795Z"
}
```

#### Validação no Prisma Studio

Abra o Prisma Studio (`npx prisma studio`) e acesse a tabela `Notification`. A nova linha deve aparecer com `read: false` e os dados enviados na requisição.

#### Validação no Mailpit

Acesse `http://localhost:8025`. O e-mail enviado deve aparecer na caixa de entrada com o assunto definido em `emailSubject` e o conteúdo HTML de `emailHtml` renderizado.

#### Vídeo de demonstração
<video src="./assets/backend/cenarios-de-teste/cenario-teste-1.mp4" controls width="100%"></video>

---

### Cenário 2 — Enviar notificação com corpo inválido

**Rota:** `POST /notifications/send`

**Objetivo:** Demonstrar a validação de entrada — campos inválidos ou ausentes retornam 400 com detalhes por campo.

#### Requisição

```http
POST /notifications/send
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "userId": "nao-e-um-uuid",
  "type": "TIPO_INVALIDO"
}
```

#### Resposta esperada — `400 Bad Request`

```json
{
  "error": {
    "fieldErrors": {
      "userId": ["Invalid uuid"],
      "type": ["Invalid enum value. Expected 'APPOINTMENT_CREATED' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'APPOINTMENT_RESCHEDULED'"],
      "title": ["Required"],
      "message": ["Required"],
      "emailSubject": ["Required"],
      "emailHtml": ["Required"]
    },
    "formErrors": []
  }
}
```

---

### Cenário 3 — Enviar notificação para usuário inexistente

**Rota:** `POST /notifications/send`

**Objetivo:** Demonstrar que a API valida a existência do usuário destinatário antes de enviar.

#### Requisição

```http
POST /notifications/send
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "userId": "00000000-0000-0000-0000-000000000000",
  "type": "APPOINTMENT_CREATED",
  "title": "Consulta agendada",
  "message": "Sua consulta foi agendada.",
  "emailSubject": "MedHub — Consulta agendada",
  "emailHtml": "<p>Sua consulta foi agendada.</p>"
}
```

#### Resposta esperada — `404 Not Found`

```json
{
  "error": "Usuário destinatário não encontrado."
}
```

---

### Cenário 4 — Listar notificações (padrão)

**Rota:** `GET /notifications`

**Objetivo:** Demonstrar a listagem paginada de notificações do usuário autenticado com os valores padrão (página 1, limite 20).

#### Requisição

```http
GET /notifications
Authorization: Bearer <token>
```

#### Resposta esperada — `200 OK`

```json
{
  "data": [
    {
      "id": "00000000-0000-0000-0000-000000000010",
      "userId": "<id-de-ana>",
      "type": "APPOINTMENT_CREATED",
      "title": "Consulta agendada",
      "message": "Sua consulta com Dr. Carlos Médico foi agendada.",
      "read": false,
      "appointmentId": "00000000-0000-0000-0000-000000000002",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 4,
    "totalPages": 1
  }
}
```

> A listagem retorna 4 notificações: 3 criadas pelo seed + 1 criada no cenário 1. O exemplo acima mostra apenas o primeiro item.

---

### Cenário 5 — Listar com paginação customizada

**Rota:** `GET /notifications?page=1&limit=2`

**Objetivo:** Demonstrar o controle de paginação — limitar a 2 itens por página.

#### Requisição

```http
GET /notifications?page=1&limit=2
Authorization: Bearer <token>
```

#### Resposta esperada — `200 OK`

```json
{
  "data": [
    {
      "id": "00000000-0000-0000-0000-000000000010",
      "userId": "<id-de-ana>",
      "type": "APPOINTMENT_CREATED",
      "title": "Consulta agendada",
      "message": "Sua consulta com Dr. Carlos Médico foi agendada.",
      "read": false,
      "appointmentId": "00000000-0000-0000-0000-000000000002",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    },
    {
      "id": "00000000-0000-0000-0000-000000000011",
      "userId": "<id-de-ana>",
      "type": "APPOINTMENT_CONFIRMED",
      "title": "Consulta confirmada",
      "message": "Sua consulta com Dr. Carlos Médico foi confirmada.",
      "read": false,
      "appointmentId": "00000000-0000-0000-0000-000000000002",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 4,
    "totalPages": 2
  }
}
```

---

### Cenário 6 — Contar notificações não lidas

**Rota:** `GET /notifications/unread-count`

**Objetivo:** Demonstrar o endpoint de contagem antes de qualquer marcação como lida, estabelecendo o valor inicial para comparação no cenário 10.

#### Requisição

```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

#### Resposta esperada — `200 OK`

```json
{
  "count": 3
}
```

> O seed cria 2 notificações não lidas para Ana + o cenário 1 criou mais 1. A notificação `...000012` (APPOINTMENT_CANCELLED) já estava lida no seed, por isso não entra na contagem.

---

### Cenário 7 — Marcar uma notificação como lida

**Rota:** `PATCH /notifications/:id/read`

**Objetivo:** Demonstrar que uma notificação específica pode ser marcada como lida individualmente.

#### Requisição

```http
PATCH /notifications/00000000-0000-0000-0000-000000000010/read
Authorization: Bearer <token>
```

#### Resposta esperada — `200 OK`

```json
{
  "id": "00000000-0000-0000-0000-000000000010",
  "userId": "<id-de-ana>",
  "type": "APPOINTMENT_CREATED",
  "title": "Consulta agendada",
  "message": "Sua consulta com Dr. Carlos Médico foi agendada.",
  "read": true,
  "appointmentId": "00000000-0000-0000-0000-000000000002",
  "createdAt": "<timestamp>",
  "updatedAt": "<timestamp>"
}
```

#### Validação no Prisma Studio

Na tabela `Notification`, localize o registro pelo ID da requisição. O campo `read` deve estar como `true`.

---

### Cenário 8 — Filtrar apenas notificações não lidas

**Rota:** `GET /notifications?unreadOnly=true`

**Objetivo:** Demonstrar o filtro de não lidas — a notificação marcada como lida no cenário 7 não deve aparecer no resultado.

#### Requisição

```http
GET /notifications?unreadOnly=true
Authorization: Bearer <token>
```

#### Resposta esperada — `200 OK`

```json
{
  "data": [
    {
      "id": "00000000-0000-0000-0000-000000000011",
      "userId": "<id-de-ana>",
      "type": "APPOINTMENT_CONFIRMED",
      "title": "Consulta confirmada",
      "message": "Sua consulta com Dr. Carlos Médico foi confirmada.",
      "read": false,
      "appointmentId": "00000000-0000-0000-0000-000000000002",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

> Após o cenário 7, a notificação `...000010` foi marcada como lida. Restam 2 não lidas: `...000011` (APPOINTMENT_CONFIRMED) e a criada no cenário 1.

---

### Cenário 9 — Marcar notificação inexistente como lida

**Rota:** `PATCH /notifications/:id/read`

**Objetivo:** Demonstrar o comportamento quando o ID não existe ou não pertence ao usuário autenticado.

#### Requisição

```http
PATCH /notifications/00000000-0000-0000-0000-000000000000/read
Authorization: Bearer <token>
```

#### Resposta esperada — `404 Not Found`

```json
{
  "error": "Notificação não encontrada."
}
```

---

### Cenário 10 — Marcar todas as notificações como lidas

**Rota:** `PATCH /notifications/read-all`

**Objetivo:** Demonstrar que todas as notificações do usuário são marcadas como lidas de uma só vez, zerando o contador.

#### Requisição

```http
PATCH /notifications/read-all
Authorization: Bearer <token>
```

#### Resposta esperada — `204 No Content`

*(sem corpo na resposta)*

#### Validação no Prisma Studio

Na tabela `Notification`, filtre pelo `userId` do usuário autenticado. Todos os registros devem ter `read: true`.

#### Confirmação com GET /unread-count

Após o `204`, execute uma nova requisição para confirmar que o contador zerou:

```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

```json
{
  "count": 0
}
```
