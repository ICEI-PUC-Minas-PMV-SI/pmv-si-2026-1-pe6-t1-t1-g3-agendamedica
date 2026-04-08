# Cenários de Teste — API de Notificações (RF-006)

## Contexto

Este documento descreve os cenários de teste para a API de notificações do MedHub, implementada no RF-006. Cada cenário corresponde a um vídeo de demonstração gravado via Postman, cobrindo um comportamento isolado da API.

**Base URL:** `http://localhost:3000`

**Autenticação:** todos os endpoints exigem o header:
```
Authorization: Bearer <token>
```

> Os IDs de usuário e notificação utilizados nos exemplos devem ser substituídos pelos valores reais do seu banco de dados.

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
  "createdAt": "<timestamp>",
  "updatedAt": "<timestamp>"
}
```

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
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
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

### Cenário 5 — Filtrar apenas notificações não lidas

**Rota:** `GET /notifications?unreadOnly=true`

**Objetivo:** Demonstrar o filtro de não lidas — apenas notificações com `read: false` são retornadas.

#### Requisição

```http
GET /notifications?unreadOnly=true
Authorization: Bearer <token>
```

#### Resposta esperada — `200 OK`

```json
{
  "data": [ /* somente notificações com read: false */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": "<n>",
    "totalPages": "<n>"
  }
}
```

---

### Cenário 6 — Listar com paginação customizada

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
  "data": [ /* máximo 2 itens */ ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": "<n>",
    "totalPages": "<n>"
  }
}
```

---

### Cenário 7 — Contar notificações não lidas

**Rota:** `GET /notifications/unread-count`

**Objetivo:** Demonstrar o endpoint de contagem de notificações não lidas do usuário autenticado.

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

---

### Cenário 8 — Marcar uma notificação como lida

**Rota:** `PATCH /notifications/:id/read`

**Objetivo:** Demonstrar que uma notificação específica pode ser marcada como lida individualmente.

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
  "createdAt": "<timestamp>",
  "updatedAt": "<timestamp>"
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

**Objetivo:** Demonstrar que todas as notificações do usuário autenticado são marcadas como lidas de uma só vez.

#### Requisição

```http
PATCH /notifications/read-all
Authorization: Bearer <token>
```

#### Resposta esperada — `204 No Content`

*(sem corpo na resposta)*
