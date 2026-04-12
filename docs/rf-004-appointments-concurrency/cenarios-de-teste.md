# Cenários de Teste: API de Validação de Disponibilidade e Conflitos de Horários (RF-004)

## Contexto

Este documento descreve os cenários de teste para as funções de validação de disponibilidade e prevenção de conflitos de horários (RF-004) do MedHub. Cada cenário testa a lógica de proteção contra sobreposição de agendamentos, aplicando uma janela de 20 minutos antes e depois de cada consulta para impedir conflitos.

**Base URL:** `http://localhost:3000`

**Autenticação:** todos os endpoints exigem o header:
```
Authorization: Bearer <token>
```

As validações de disponibilidade e conflitos de horários são realizadas com base no token JWT fornecido no header Authorization. O token identifica o usuário autenticado, permitindo verificar conflitos específicos para o médico associado ao agendamento.

## Ferramentas utilizadas

| Ferramenta   | O que é                                    | Por que usamos                                                                                               |
| ------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Insomnia** | Cliente HTTP para enviar requisições à API | Permite executar cenários de concorrência de forma controlada e visualizar as respostas de erro com detalhes |

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

**Objetivo:** Demonstrar que agendamentos são rejeitados quando tentam marcar em até 20 minutos após uma consulta existente.

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

#### Evidência no Insomnia

![Agendamento em conflito no Insomnia](./assets/img/agendamento-horario-indisponivel.png)

A imagem mostra o agendamento rejeitado devido a conflito de horário no Insomnia, com status 400 Bad Request e mensagem de erro sobre horário indisponível.


---

### Cenário 2: Agendamento em horário dísponivel

**Rota:** `POST /appointments/createAppointment`

**Objetivo:** Demonstrar que agendamentos são permitidos dentro do horário dísponivel pelo médico.

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
    "date": "2026-04-15T13:40:00Z",
    "notes": "Agendamento exatamente 20min antes - deve ser permitido"
}
```

#### Resposta esperada: `201 Created`

```json
{
    "id": "uuid-gerado",
    "patientId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "doctorId": "84cb80c3-941f-4700-8123-32de4609ebfe",
    "date": "2026-04-15T13:40:00.000Z",
    "status": "PENDING",
    "notes": "Agendamento exatamente 20min antes - deve ser permitido",
    "createdAt": "2026-04-09T21:47:35.795Z",
    "updatedAt": "2026-04-09T21:47:35.795Z"
}
```

#### Evidência no Insomnia

![Agendamento autorizado no Insomnia](./assets/img/agendamento-autorizado.png)

A imagem mostra o agendamento autorizado na borda da janela de proteção no Insomnia, com status 201 Created e os dados do agendamento retornados.


---
