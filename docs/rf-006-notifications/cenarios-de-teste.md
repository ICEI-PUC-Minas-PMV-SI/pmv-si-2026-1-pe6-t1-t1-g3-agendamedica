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
POST /notifications/send HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
Content-Length: 64

{
    "userId": "nao-e-um-uuid",
    "type": "TIPO_INVALIDO"
}
```

#### Resposta esperada — `400 Bad Request`

```json
{
    "error": {
        "formErrors": [],
        "fieldErrors": {
            "userId": [
                "Invalid uuid"
            ],
            "type": [
                "Invalid enum value. Expected 'APPOINTMENT_CREATED' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'APPOINTMENT_RESCHEDULED', received 'TIPO_INVALIDO'"
            ],
            "title": [
                "Required"
            ],
            "message": [
                "Required"
            ],
            "emailSubject": [
                "Required"
            ],
            "emailHtml": [
                "Required"
            ]
        }
    }
}
```

#### Print de demonstração
![Print do Postman mostrando a resposta de erro com detalhes de validação por campo](./assets/backend/cenarios-de-teste/cenario-teste-2.png)

---

### Cenário 3 — Enviar notificação para usuário diferente do autenticado

**Rota:** `POST /notifications/send`

**Objetivo:** Demonstrar que a API não permite criar notificações para outros usuários, retornando 403 para evitar exposição de existência de usuários.

#### Requisição

```http
POST /notifications/send HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
Content-Length: 312

{
    "userId": "00000000-0000-0000-0000-000000000000",
    "type": "APPOINTMENT_CREATED",
    "title": "Consulta agendada",
    "message": "Sua consulta foi agendada para amanhã às 10h.",
    "emailSubject": "MedHub — Consulta agendada",
    "emailHtml": "<p>Sua consulta foi agendada para amanhã às 10h.</p>"
}
```

#### Resposta esperada — `403 Forbidden`

```json
{
    "error": "Pacientes só podem enviar notificações para si mesmos."
}
```

#### Print de demonstração
![Print do Postman mostrando a resposta 403 Forbidden com a mensagem de erro](./assets/backend/cenarios-de-teste/cenario-teste-3.png)
---

### Cenário 4 — Listar notificações (padrão)

**Rota:** `GET /notifications`

**Objetivo:** Demonstrar a listagem paginada de notificações do usuário autenticado com os valores padrão (página 1, limite 20).

#### Requisição

```http
GET /notifications HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
```

#### Resposta esperada — `200 OK`

```json
{
    "data": [
        {
            "id": "b9e600b7-652c-4a2a-97c6-2e40eaae198f",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CREATED",
            "title": "Consulta agendada",
            "message": "Sua consulta foi agendada para amanhã às 10h.",
            "appointmentId": null,
            "read": false,
            "createdAt": "2026-04-09T21:47:35.795Z"
        },
        {
            "id": "fb01fe17-d0e7-40c1-adea-0123f367641f",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CREATED",
            "title": "Consulta agendada",
            "message": "Sua consulta foi agendada para amanhã às 10h.",
            "appointmentId": null,
            "read": false,
            "createdAt": "2026-04-09T21:43:14.175Z"
        },
        {
            "id": "c0b05d96-36be-4888-8d2d-01014fece708",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CREATED",
            "title": "Consulta agendada",
            "message": "Sua consulta foi agendada para amanhã às 10h.",
            "appointmentId": null,
            "read": false,
            "createdAt": "2026-04-09T21:40:23.766Z"
        },
        {
            "id": "00000000-0000-0000-0000-000000000010",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CREATED",
            "title": "Consulta agendada",
            "message": "Sua consulta com Dr. Carlos Médico foi agendada.",
            "appointmentId": "00000000-0000-0000-0000-000000000002",
            "read": false,
            "createdAt": "2026-04-09T21:24:11.592Z"
        },
        ...
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 6,
        "totalPages": 1
    }
}
```

#### Vídeo de demonstração
<video src="./assets/backend/cenarios-de-teste/cenario-teste-4.mp4" controls width="100%"></video>

---

### Cenário 5 — Listar com paginação customizada

**Rota:** `GET /notifications?page=1&limit=2`

**Objetivo:** Demonstrar o controle de paginação — limitar a 2 itens por página.

#### Requisição

```http
GET /notifications?page=1&limit=2&unreadOnly=true HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
```

#### Resposta esperada — `200 OK`

```json
{
    "data": [
        {
            "id": "b9e600b7-652c-4a2a-97c6-2e40eaae198f",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CREATED",
            "title": "Consulta agendada",
            "message": "Sua consulta foi agendada para amanhã às 10h.",
            "appointmentId": null,
            "read": false,
            "createdAt": "2026-04-09T21:47:35.795Z"
        },
        {
            "id": "fb01fe17-d0e7-40c1-adea-0123f367641f",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CREATED",
            "title": "Consulta agendada",
            "message": "Sua consulta foi agendada para amanhã às 10h.",
            "appointmentId": null,
            "read": false,
            "createdAt": "2026-04-09T21:43:14.175Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 2,
        "total": 5,
        "totalPages": 3
    }
}
```

#### Print de demonstração
![Print do Postman mostrando a resposta com apenas 2 itens no array data e os detalhes de paginação indicando total de 5 itens e 3 páginas](./assets/backend/cenarios-de-teste/cenario-teste-5.png)


---

### Cenário 6 — Contar notificações não lidas

**Rota:** `GET /notifications/unread-count`

**Objetivo:** Demonstrar o endpoint de contagem antes de qualquer marcação como lida, estabelecendo o valor inicial para comparação no cenário 10.

#### Requisição

```http
GET /notifications/unread-count HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
```

#### Resposta esperada — `200 OK`

```json
{
    "count": 5
}
```

#### Print de demonstração
![Print do Postman mostrando a resposta com o campo count igual a 5](./assets/backend/cenarios-de-teste/cenario-teste-6.png)

---

### Cenário 7 — Marcar uma notificação como lida

**Rota:** `PATCH /notifications/:id/read`

**Objetivo:** Demonstrar que uma notificação específica pode ser marcada como lida individualmente.

#### Requisição

```http
PATCH /notifications/00000000-0000-0000-0000-000000000010/read HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
```

#### Resposta esperada — `200 OK`

```json
{
    "id": "00000000-0000-0000-0000-000000000010",
    "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "type": "APPOINTMENT_CREATED",
    "title": "Consulta agendada",
    "message": "Sua consulta com Dr. Carlos Médico foi agendada.",
    "appointmentId": "00000000-0000-0000-0000-000000000002",
    "read": true,
    "createdAt": "2026-04-09T21:24:11.592Z"
}
```

#### Validação no Prisma Studio

Na tabela `Notification`, localize o registro pelo ID da requisição. O campo `read` deve estar como `true`.

#### Vídeo de demonstração
<video src="./assets/backend/cenarios-de-teste/cenario-teste-7.mp4" controls width="100%"></video>

---

### Cenário 8 — Filtrar apenas notificações não lidas

**Rota:** `GET /notifications?unreadOnly=true`

**Objetivo:** Demonstrar o filtro de não lidas — a notificação marcada como lida no cenário 7 não deve aparecer no resultado.

#### Requisição

```http
GET /notifications?unreadOnly=true HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
```

#### Resposta esperada — `200 OK`

```json
{
    "data": [
        {
            "id": "b9e600b7-652c-4a2a-97c6-2e40eaae198f",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CREATED",
            "title": "Consulta agendada",
            "message": "Sua consulta foi agendada para amanhã às 10h.",
            "appointmentId": null,
            "read": false,
            "createdAt": "2026-04-09T21:47:35.795Z"
        },
        {
            "id": "fb01fe17-d0e7-40c1-adea-0123f367641f",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CREATED",
            "title": "Consulta agendada",
            "message": "Sua consulta foi agendada para amanhã às 10h.",
            "appointmentId": null,
            "read": false,
            "createdAt": "2026-04-09T21:43:14.175Z"
        },
        {
            "id": "c0b05d96-36be-4888-8d2d-01014fece708",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CREATED",
            "title": "Consulta agendada",
            "message": "Sua consulta foi agendada para amanhã às 10h.",
            "appointmentId": null,
            "read": false,
            "createdAt": "2026-04-09T21:40:23.766Z"
        },
        {
            "id": "00000000-0000-0000-0000-000000000011",
            "userId": "84cb80c3-941f-4700-8123-32de4609ebfe",
            "type": "APPOINTMENT_CONFIRMED",
            "title": "Consulta confirmada",
            "message": "Sua consulta com Dr. Carlos Médico foi confirmada.",
            "appointmentId": "00000000-0000-0000-0000-000000000002",
            "read": false,
            "createdAt": "2026-04-09T21:24:11.592Z"
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

#### Print de demonstração
![Print do Postman mostrando a resposta com apenas as notificações que têm read: false, confirmando que a notificação marcada como lida no cenário 7 não aparece](./assets/backend/cenarios-de-teste/cenario-teste-8.png)

---

### Cenário 9 — Marcar notificação inexistente como lida

**Rota:** `PATCH /notifications/:id/read`

**Objetivo:** Demonstrar o comportamento quando o ID não existe ou não pertence ao usuário autenticado.

#### Requisição

```http
PATCH /notifications/00000000-0000-0000-0000-000000000019/read HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
```

#### Resposta esperada — `404 Not Found`

```json
{
  "error": "Notificação não encontrada."
}
```

#### Print de demonstração
![Print do Postman mostrando a resposta 404 Not Found com a mensagem de erro](./assets/backend/cenarios-de-teste/cenario-teste-9.png)

---

### Cenário 10 — Marcar todas as notificações como lidas

**Rota:** `PATCH /notifications/read-all`

**Objetivo:** Demonstrar que todas as notificações do usuário são marcadas como lidas de uma só vez.

#### Requisição

```http
PATCH /notifications/read-all HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
```

#### Resposta esperada — `204 No Content`

*(sem corpo na resposta)*

#### Validação no Prisma Studio

Na tabela `Notification`, filtre pelo `userId` do usuário autenticado. Todos os registros devem ter `read: true`.

#### Vídeo de demonstração
<video src="./assets/backend/cenarios-de-teste/cenario-teste-10.mp4" controls width="100%"></video>
