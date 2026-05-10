# Cenários de Teste — Conflito de Horários Frontend (RF-004)

## Contexto

Este documento descreve os cenários de teste projetados para validar a regra de concorrência e indisponibilidade de agenda do MedHub.

**Requisito funcional:** RF-004 — O sistema deve impedir o agendamento de mais de uma consulta para o mesmo médico no mesmo horário.

**URL local:** `http://localhost:5173`

**Autenticação:** fazer login como Paciente ou Recepção.

---

## Ferramentas utilizadas

| Ferramenta             | O que é                                          | Por que usamos                                                                                                              |
| ---------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Navegador**          | Chrome ou Firefox                                | Executar a aplicação e capturar os cenários                                                                                 |
| **Mock Server**        | Servidor Express local (`mock-server/server.js`) | Rejeita requisições HTTP 400 simulando a falha de constraint única que aconteceria no Prisma do banco de dados real.        |

---

## Pré-requisitos

1. Iniciar o mock server: `node mock-server/server.js` (porta 3001)
2. Iniciar o frontend: `npm run dev` (porta 5173)
3. Garantir que exista uma consulta marcada para hoje no sistema para podermos forçar a colisão.

---

## Seção 1 — Concorrência na Interface

---

### Cenário 1 — Tentar agendar no mesmo horário de consulta já existente
**RF-004:** Impedir mais de uma consulta para mesmo médico e horário.

**Componente:** `ScheduleView`

**Objetivo:** Demonstrar o comportamento seguro da interface web quando a API rejeita uma tentativa de duplo agendamento.

**Pré-condição:** Autenticado. Existência prévia de consulta (Ex: Dra. Marina Figueiredo, Hoje, 14:00).

**Passos:**
1. Acessar "Agendar".
2. Selecionar o mesmo Médico ("Dra. Marina Figueiredo").
3. Selecionar a mesma Data.
4. Escolher o mesmo Horário da consulta já alocada.
5. Clicar em "Confirmar agendamento".

**Resultado esperado:**
- O envio (`POST`) é feito, mas a API retorna Status 400.
- A tela de carregamento fecha.
- Um banner visual ou notificação (toast) de erro exibe a mensagem "Horário indisponível".
- A interface é mantida na mesma tela, permitindo que o usuário escolha um horário diferente sem perder todo o progresso do formulário.

**Mídia:** [▶ Cenário 1](../assets/frontend/cenarios-de-teste/cenario-rf004-1.mp4)
