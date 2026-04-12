# Cenários de Teste: API de Controle de Acesso e Autorização de Agendamentos (RF-003)

## Contexto

Este documento descreve os cenários de teste para as funções de controle de acesso e autorização de agendamentos (RF-003) do MedHub. Cada cenário corresponde a um comportamento isolado da API relacionado à segurança.

**Base URL:** `http://localhost:3000`

**Autenticação:** todos os endpoints exigem o header:
```
Authorization: Bearer <token>
```

As validações de acesso e autorização são realizadas com base no token JWT fornecido no header Authorization. O token contém o ID do usuário autenticado e seu papel (role: PATIENT, DOCTOR ou RECEPTIONIST), permitindo que a API verifique permissões específicas para cada operação, como impedir que pacientes acessem consultas de outros usuários.

## Ferramentas utilizadas

| Ferramenta   | O que é                                    | Por que usamos                                                                          |
| ------------ | ------------------------------------------ | --------------------------------------------------------------------------------------- |
| **Insomnia** | Cliente HTTP para enviar requisições à API | Permite executar cada cenário de forma isolada e visualizar as respostas com formatação |

---

## Referência rápida de endpoints

| Método | Rota                             | Descrição                                |
| ------ | -------------------------------- | ---------------------------------------- |
| POST   | /appointments/createAppointment  | Criar agendamento                        |
| GET    | /appointments/:id                | Obter detalhes de agendamento específico |
| PATCH  | /appointments/confirmAppointment | Confirmar agendamento                    |
| PATCH  | /appointments/:id                | Atualizar agendamento                    |

---

## Pré-requisitos

Antes de iniciar os cenários, configure o ambiente com dados de teste:

1. Com o banco rodando, execute o seed em `src/backend/`:
   ```
   node scripts/clear-db.js && node scripts/seed.js
   ```
2. O seed imprime os comandos para gerar tokens. Execute os comandos para diferentes roles:
   ```
   node scripts/gen-token.js <id-de-paciente>
   node scripts/gen-token.js <id-de-medico>
   node scripts/gen-token.js <id-de-recepcionista>
   ```
3. Use os tokens gerados no header `Authorization: Bearer <token>` de todas as requisições.

O seed é idempotente: pode ser re-executado sem duplicar dados.

---

## Cenários de Teste

### Cenário 1: Paciente cria agendamento para si mesmo

**Rota:** `POST /appointments/createAppointment`

**Objetivo:** Demonstrar que pacientes podem criar agendamentos apenas para si mesmos.

#### Requisição

```http
POST /appointments/createAppointment HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
Content-Length: 312
```
Body:
```json
{
    "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "doctorId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "date": "2026-04-15T14:30:00Z",
    "notes": "Consulta de rotina"
}

```

#### Resposta esperada: `201 Created`

```json
{
    "id": "uuid-gerado",
    "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "doctorId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "date": "2026-04-15T14:30:00.000Z",
    "status": "PENDING",
    "notes": "Consulta de rotina",
    "createdAt": "2026-04-09T21:47:35.795Z",
    "updatedAt": "2026-04-09T21:47:35.795Z"
}
```

#### Evidência no Insomnia

![Agendamento criado com sucesso](./assets/img/agendamento-com-sucesso.png)

A imagem mostra a criação bem-sucedida de um agendamento no Insomnia, com status 201 Created e os dados do agendamento retornados.


---

### Cenário 2: Paciente tenta criar agendamento para outro paciente

**Rota:** `POST /appointments/createAppointment`

**Objetivo:** Demonstrar que pacientes não podem criar agendamentos para outros pacientes.

#### Requisição

```http
POST /appointments/createAppointment HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
Content-Length: 312
```
Body:
```json
{
    "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "doctorId": "00000000-1000-0000-0000-000000000002",
    "date": "2026-04-15T14:30:00Z",
    "notes": "Tentativa não autorizada"
}
```

#### Resposta esperada: `403 Forbidden`

```json
{
    "error": "Acesso negado: Essa consulta não pertence ao usuário autenticado."
}
```
#### Evidência no Insomnia

![Agendamento não autorizado](./assets/img/agendamento-nao-autorizado.png)

A imagem mostra a tentativa não autorizada de agendamento para outro paciente, com status 403 Forbidden e mensagem de erro de acesso negado.


---

### Cenário 3: Paciente acessa própria consulta

**Rota:** `GET /appointments`

**Objetivo:** Demonstrar que pacientes podem acessar detalhes de suas próprias consultas.

#### Requisição

```http
GET /appointments HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
```

#### Resposta esperada: `200 OK`

```json
[
    {
        "id": "00000000-1000-0000-0000-000000000002",
        "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
        "doctorId": "84cb80c3-941f-4700-8123-32de4609ebfe",
        "date": "2026-04-10T15:00:00.000Z",
        "status": "CONFIRMED",
        "notes": "Segunda consulta. Ana",
        "createdAt": "2026-04-09T12:00:00.000Z",
        "updatedAt": "2026-04-09T12:00:00.000Z"
    },
    {
        "id": "00000000-2000-0000-0000-000000000003",
        "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
        "doctorId": "db7c23fa-7f9b-4a4a-9d0b-e3f1b2c98765",
        "date": "2026-04-15T14:30:00.000Z",
        "status": "PENDING",
        "notes": "Consulta de rotina",
        "createdAt": "2026-04-09T21:47:35.795Z",
        "updatedAt": "2026-04-09T21:47:35.795Z"
    },
    {
        "id": "00000000-3000-0000-0000-000000000004",
        "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
        "doctorId": "84cb80c3-941f-4700-8123-32de4609ebfe",
        "date": "2026-04-20T10:00:00.000Z",
        "status": "CONFIRMED",
        "notes": "Consulta de acompanhamento",
        "createdAt": "2026-04-09T14:30:00.000Z",
        "updatedAt": "2026-04-09T14:30:00.000Z"
    }
]
```

#### Evidência no Insomnia

![Listagem autorizada](./assets/img/listagem-autorizada.png)

A imagem mostra o acesso autorizado aos detalhes das próprias consultas no Insomnia, com status 200 OK e os dados retornados.


---

### Cenário 4: Paciente tenta acessar consulta de outro paciente

**Rota:** `GET /appointments/:id`

**Objetivo:** Demonstrar que pacientes não podem acessar consultas de outros usuários.

#### Requisição

```http
GET /appointments/84cb80c3-941f-4700-8123-32de4609ebfe HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
```

#### Resposta esperada: `403 Forbidden`

```json
{
    "error": "Acesso negado: Essa consulta não pertence ao usuário autenticado."
}
```

#### Evidência no Insomnia

![Listagem não autorizada](./assets/img/listagem-nao-autorizada.png)

A imagem mostra a tentativa de acesso não autorizado à consulta de outro paciente, com status 403 Forbidden e mensagem de erro.

