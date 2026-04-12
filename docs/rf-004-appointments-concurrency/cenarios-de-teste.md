# Cenários de Teste: API de Validação de Disponibilidade e Conflitos de Horários (RF-004)

## Contexto

Este documento descreve os cenários de teste para as funções de validação de disponibilidade e prevenção de conflitos de horários (RF-004) do MedHub. Cada cenário testa a lógica de proteção contra sobreposição de agendamentos, aplicando uma janela de 20 minutos antes e depois de cada consulta para impedir conflitos.

**Base URL:** `http://localhost:3000`

**Autenticação:** todos os endpoints exigem o header:
```
Authorization: Bearer <token>
```

## Ferramentas utilizadas

| Ferramenta        | O que é                                           | Por que usamos                                                                                                                 |
| ----------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Insomnia**      | Cliente HTTP para enviar requisições à API        | Permite executar cenários de concorrência de forma controlada e visualizar as respostas de erro com detalhes                   |
| **Prisma Studio** | Interface visual para o banco de dados PostgreSQL | Permite verificar os agendamentos existentes e confirmar que novos agendamentos respeitam as janelas de proteção de 20 minutos |

### Por que o Prisma Studio é necessário neste contexto

Os cenários de concorrência dependem do estado atual do banco de dados. O Prisma Studio permite:

- Verificar agendamentos existentes para um médico específico
- Confirmar que novos agendamentos são rejeitados quando há conflitos
- Inspecionar as datas e horários dos agendamentos para validar a lógica de 20 minutos

---

## Referência rápida de endpoints

| Método | Rota                            | Descrição             |
| ------ | ------------------------------- | --------------------- |
| POST   | /appointments/createAppointment | Criar agendamento     |
| PATCH  | /appointments/:id               | Atualizar agendamento |

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

O seed é idempotente, pode ser re-executado sem duplicar dados.

---

## Cenários de Teste

### Cenário 1: Agendamento dentro da janela em horário indisponivel

**Rota:** `POST /appointments/createAppointment`

**Objetivo:** Demonstrar que agendamentos são rejeitados quando tentam marcar dentro de 20 minutos antes de uma consulta existente.

#### Requisição

```http
POST /appointments/createAppointment HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
Content-Length: 312

{
    "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "doctorId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "date": "2026-04-15T13:45:00Z",
    "notes": "Tentativa de marcar 15min antes de consulta existente"
}
```

#### Resposta esperada: `400 Bad Request`

```json
{
    "error": "Horário indisponível. Há um conflito com outra consulta já agendada próxima às 14:00:00."
}
```

#### Validação no Prisma Studio

Abra o Prisma Studio (`npx prisma studio`) e verifique na tabela `Appointment` que existe uma consulta confirmada para o médico às 14:00. O novo agendamento foi rejeitado por estar dentro da janela de proteção.

---

### Cenário 3: Agendamento exatamente na borda da janela (20 minutos antes)

**Rota:** `POST /appointments/createAppointment`

**Objetivo:** Demonstrar que agendamentos são permitidos exatamente na borda da janela de proteção (20 minutos antes).

#### Requisição

```http
POST /appointments/createAppointment HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NGNiODBjMy05NDFmLTQ3MDAtODEyMy0zMmRlNDYwOWViZmUiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc3NTc2OTg2NSwiZXhwIjoxNzc1ODU2MjY1fQ.vo5hfoMg8D7-iXfn3_M2XTJMNe51n_cGacKqanrEmVo
Content-Length: 312

{
    "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "doctorId": "doctor-id-com-consulta-as-14h",
    "date": "2026-04-15T13:40:00Z",
    "notes": "Agendamento exatamente 20min antes - deve ser permitido"
}
```

#### Resposta esperada: `201 Created`

```json
{
    "id": "uuid-gerado",
    "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "doctorId": "doctor-id-com-consulta-as-14h",
    "date": "2026-04-15T13:40:00.000Z",
    "status": "PENDING",
    "notes": "Agendamento exatamente 20min antes - deve ser permitido",
    "createdAt": "2026-04-09T21:47:35.795Z",
    "updatedAt": "2026-04-09T21:47:35.795Z"
}
```

#### Validação no Prisma Studio

Confirme que o novo agendamento foi criado com sucesso, pois está exatamente na borda permitida (20 minutos antes).

---
