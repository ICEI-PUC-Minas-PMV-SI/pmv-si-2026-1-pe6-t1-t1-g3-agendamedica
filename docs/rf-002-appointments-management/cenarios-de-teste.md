# Cenários de Teste: API de Edição e Gerenciamento de Consultas (RF-002)

## Contexto

Este documento descreve os cenários de teste para as funções de gerenciamento secundário de agendamentos (RF-002) do MedHub, que envolvem a edição/remarcação via a rota PATCH genérica. Cada cenário corresponde a um comportamento isolado da API.

**Base URL:** `http://localhost:3000`

**Autenticação:** todos os endpoints exigem o header:
```
Authorization: Bearer <token>
```

## Ferramentas utilizadas

| Ferramenta        | O que é                                           | Por que usamos                                                                                                                           |
| ----------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Insomnia**      | Cliente HTTP para enviar requisições à API        | Permite executar cada cenário de forma isolada e visualizar as respostas com formatação                                                  |
| **Prisma Studio** | Interface visual para o banco de dados PostgreSQL | Permite verificar as mudanças persistidas no banco após cada operação: por exemplo, confirmar que a data foi alterada após reagendamento |

### Por que o Prisma Studio é necessário neste contexto

Os endpoints de appointments modificam o banco de dados diretamente. O Prisma Studio permite:

- Verificar a alteração de registros na tabela Appointment
- Confirmar mudanças de data, médico ou notas
- Inspecionar relacionamentos com User (patient/doctor)

---

## Referência rápida de endpoints

| Método | Rota              | Descrição             |
| ------ | ----------------- | --------------------- |
| PATCH  | /appointments/:id | Atualizar agendamento |

---

## Pré-requisitos

Antes de iniciar os cenários, configure o ambiente com dados de teste:

1. Com o banco rodando, execute o seed em `src/backend/`:
   ```
   node scripts/clear-db.js && node scripts/seed.js
   ```
2. O seed imprime os comandos para gerar tokens. Execute o comando para o paciente de teste gerado pelo seed:
   ```
   node scripts/gen-token.js <id-do-paciente-1>
   ```
3. Use o token gerado no header `Authorization: Bearer <token>` de todas as requisições.

O seed pode ser re-executado sem duplicar dados.

**Estado inicial criado pelo seed (Paciente 1: usuário de teste do tipo paciente):**

| ID do agendamento                      | Médico     | Data                 | Status  |
| -------------------------------------- | ---------- | -------------------- | ------- |
| `00000000-3000-0000-0000-000000000002` | Dra. Maria | 2026-04-12T14:00:00Z | PENDING |

---

## Cenários de Teste

### Cenário 1: Reagendar e atualizar campos múltiplos com sucesso

**Rota:** `PATCH /appointments/:id`

**Objetivo:** Demonstrar que a API permite atualizar múltiplos campos de um agendamento em uma única requisição.

#### Requisição

```http
PATCH /appointments/00000000-3000-0000-0000-000000000002 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
Content-Length: 112

{
    "date": "2026-04-20T10:00:00Z",
    "notes": "Reagendar e atualizar médico",
    "doctorId": "db7c23fa-7f9b-4a4a-9d0b-e3f1b2c98765"
}
```

#### Resposta esperada: `200 OK`

```json
{
    "id": "00000000-3000-0000-0000-000000000002",
    "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "doctorId": "db7c23fa-7f9b-4a4a-9d0b-e3f1b2c98765",
    "date": "2026-04-20T10:00:00.000Z",
    "status": "PENDING",
    "notes": "Reagendar e atualizar médico",
    "createdAt": "2026-04-09T12:00:00.000Z",
    "updatedAt": "2026-04-09T21:47:35.795Z"
}
```

#### Validação no Prisma Studio

Abra o Prisma Studio (`npx prisma studio`) e acesse a tabela `Appointment`. Confirme que os campos `date`, `notes` e `doctorId` foram atualizados corretamente.

---

### Cenário 2: Tentativa de reagendamento com conflito de horário

**Rota:** `PATCH /appointments/:id`

**Objetivo:** Demonstrar que a API rejeita reagendamentos que criam conflito de horário para o mesmo médico.

#### Requisição

```http
PATCH /appointments/00000000-3000-0000-0000-000000000002 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
Content-Length: 58

{
    "date": "2026-04-12T14:05:00Z"
}
```

#### Resposta esperada: `400 Bad Request`

```json
{
    "error": "Horário indisponível. Há um conflito com outra consulta já agendada próxima às 14:00:00."
}
```

#### Validação no Prisma Studio

Verifique que o agendamento não foi alterado e que a data permanece como no registro original para `00000000-3000-0000-0000-000000000002`.
