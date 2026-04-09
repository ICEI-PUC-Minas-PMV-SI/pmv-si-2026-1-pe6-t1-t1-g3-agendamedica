# Cenários de Teste — API de Notificações (RF-006)

## Contexto

Este documento descreve os cenários de teste para a API de notificações do MedHub, implementada no RF-006. Cada cenário corresponde a um vídeo de demonstração, cobrindo um comportamento isolado da API.

**Base URL:** `http://localhost:3000`

**Autenticação:** todos os endpoints exigem o header:
```
Authorization: Bearer <token>
```

> Os IDs de usuário e notificação utilizados nos exemplos devem ser substituídos pelos valores reais do seu banco de dados.

---

## Ferramentas utilizadas

| Ferramenta | O que é | Por que usamos |
|---|---|---|
| **Postman** | Cliente HTTP para enviar requisições à API | Permite executar cada cenário de forma isolada e visualizar as respostas com formatação |
| **Prisma Studio** | Interface visual para o banco de dados PostgreSQL | Permite verificar as mudanças persistidas no banco após cada operação — por exemplo, confirmar que `read` passou para `true` após marcar uma notificação como lida |
| **Mailpit** | Servidor SMTP local que intercepta e-mails | Em desenvolvimento, os e-mails não são entregues a destinatários reais — o Mailpit os captura localmente para que possam ser inspecionados sem depender de credenciais SMTP externas nem arriscar envios acidentais |

### Por que o Mailpit é necessário neste contexto

A rota `POST /notifications/send` envia um e-mail via SMTP como parte do fluxo de notificação. Em produção, esse e-mail seria entregue ao endereço do usuário. Em desenvolvimento, usamos o Mailpit para:

- Não depender de uma conta de e-mail real nem de credenciais SMTP externas
- Evitar o envio acidental de e-mails durante os testes
- Inspecionar o HTML renderizado e o assunto do e-mail diretamente em `http://localhost:8025`

O Mailpit age como um servidor SMTP falso — a API acredita que está enviando o e-mail normalmente, mas ele nunca sai da máquina local.

---

## Referência rápida de endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /notifications/send | Enviar notificação |
| GET | /notifications | Listar notificações do usuário |
| GET | /notifications/unread-count | Contar notificações não lidas |
| PATCH | /notifications/:id/read | Marcar uma notificação como lida |
| PATCH | /notifications/read-all | Marcar todas as notificações como lidas |

---

## Cenários de Teste

### Cenário 1 — Enviar notificação com sucesso

**Rota:** `POST /notifications/send`

**Objetivo:** Demonstrar que a API cria a notificação no banco e retorna os dados criados.

#### Requisição

```http
POST /notifications/send
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "userId": "<id-do-paciente>",
  "type": "APPOINTMENT_CREATED",
  "title": "Consulta agendada",
  "message": "Sua consulta foi agendada para amanhã às 10h.",
  "emailSubject": "MedHub — Consulta agendada",
  "emailHtml": "<p>Sua consulta foi agendada para amanhã às 10h.</p>"
}
```

#### Resposta esperada — `201 Created`

```json
{
  "id": "<uuid-gerado>",
  "userId": "<id-do-paciente>",
  "type": "APPOINTMENT_CREATED",
  "title": "Consulta agendada",
  "message": "Sua consulta foi agendada para amanhã às 10h.",
  "read": false,
  "appointmentId": null,
  "createdAt": "2026-04-08T14:30:00.000Z",
  "updatedAt": "2026-04-08T14:30:00.000Z"
}
```

#### Validação no Prisma Studio

Abra o Prisma Studio (`npx prisma studio`) e acesse a tabela `Notification`. A nova linha deve aparecer com `read: false` e os dados enviados na requisição.

#### Validação no Mailpit

Acesse `http://localhost:8025`. O e-mail enviado deve aparecer na caixa de entrada com o assunto definido em `emailSubject` e o conteúdo HTML de `emailHtml` renderizado.

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
      "id": "<uuid>",
      "userId": "<uuid>",
      "type": "APPOINTMENT_CREATED",
      "title": "Consulta agendada",
      "message": "Sua consulta foi agendada para amanhã às 10h.",
      "read": false,
      "appointmentId": null,
      "createdAt": "2026-04-08T14:30:00.000Z",
      "updatedAt": "2026-04-08T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

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
      "id": "<uuid>",
      "userId": "<uuid>",
      "type": "APPOINTMENT_CREATED",
      "title": "Consulta agendada",
      "message": "Sua consulta foi agendada para amanhã às 10h.",
      "read": false,
      "appointmentId": null,
      "createdAt": "2026-04-08T14:30:00.000Z",
      "updatedAt": "2026-04-08T14:30:00.000Z"
    },
    {
      "id": "<uuid>",
      "userId": "<uuid>",
      "type": "APPOINTMENT_CONFIRMED",
      "title": "Consulta confirmada",
      "message": "Sua consulta foi confirmada.",
      "read": false,
      "appointmentId": null,
      "createdAt": "2026-04-08T13:00:00.000Z",
      "updatedAt": "2026-04-08T13:00:00.000Z"
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
  "count": 4
}
```

---

### Cenário 7 — Marcar uma notificação como lida

**Rota:** `PATCH /notifications/:id/read`

**Objetivo:** Demonstrar que uma notificação específica pode ser marcada como lida individualmente.

> Use o `id` de uma notificação retornada na resposta do cenário 4.

#### Requisição

```http
PATCH /notifications/<id-da-notificacao>/read
Authorization: Bearer <token>
```

#### Resposta esperada — `200 OK`

```json
{
  "id": "<id-da-notificacao>",
  "userId": "<uuid>",
  "type": "APPOINTMENT_CREATED",
  "title": "Consulta agendada",
  "message": "Sua consulta foi agendada para amanhã às 10h.",
  "read": true,
  "appointmentId": null,
  "createdAt": "2026-04-08T14:30:00.000Z",
  "updatedAt": "2026-04-08T14:30:00.000Z"
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
      "id": "<uuid>",
      "userId": "<uuid>",
      "type": "APPOINTMENT_CREATED",
      "title": "Consulta agendada",
      "message": "Sua consulta foi agendada para amanhã às 10h.",
      "read": false,
      "appointmentId": null,
      "createdAt": "2026-04-08T14:30:00.000Z",
      "updatedAt": "2026-04-08T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

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
