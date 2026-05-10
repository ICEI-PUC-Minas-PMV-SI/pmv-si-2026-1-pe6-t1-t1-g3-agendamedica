# Cenários de Teste — Agendamento de Consultas Frontend (RF-001)

## Contexto

Este documento descreve os cenários de teste para a interface web de agendamento, visualização e cancelamento de consultas do MedHub, implementada no RF-001. Cada cenário cobre um comportamento visual isolado, com passos numerados e resultado esperado para demonstração em vídeo ou print.

**Requisito funcional:** RF-001 — O sistema deve permitir que pacientes agendem, visualizem e cancelem consultas médicas.

**URL local:** `http://localhost:5173`

**Autenticação:** fazer login como paciente antes de iniciar os cenários.

---

## Ferramentas utilizadas

| Ferramenta             | O que é                                          | Por que usamos                                                                                                              |
| ---------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Navegador**          | Chrome ou Firefox                                | Executar a aplicação e capturar os cenários                                                                                 |
| **Mock Server**        | Servidor Express local (`mock-server/server.js`) | Substitui o backend real em desenvolvimento — serve consultas e simula criação e cancelamento sem depender do banco         |
| **DevTools (Network)** | Aba Network do navegador                         | Confirmar que as chamadas POST foram disparadas ao agendar ou cancelar uma consulta                                         |

---

## Pré-requisitos

1. Instalar dependências em `src/web/`: `npm install`
2. Iniciar o mock server: `node mock-server/server.js` (porta 3001)
3. Iniciar o frontend: `npm run dev` (porta 5173)
4. Acessar `http://localhost:5173` e fazer login como paciente

**Estado inicial do mock server:** lista de consultas vazia ou com consultas de exemplo em `mock-server/data/appointments.json`. Os médicos disponíveis para agendamento estão em `mock-server/data/doctors.json`.

---

## Seção 1 — Agendamento de Consulta (ScheduleView)

Cenários que cobrem o fluxo de agendamento de nova consulta, acessível pelo menu lateral "Agendar".

---

### Cenário 1 — Agendar uma nova consulta com sucesso

**RF-001:** Agendamento de consulta

**Componente:** `ScheduleView`

**Objetivo:** Demonstrar o fluxo completo de agendamento em 3 passos: seleção de especialidade, profissional, data e horário, com confirmação e exibição da tela de sucesso.

**Pré-condição:** Usuário autenticado. Mock server em execução com médicos disponíveis.

**Passos:**
1. Clicar em "Agendar" no menu lateral
2. Selecionar uma especialidade na grade de especialidades (passo 1)
3. Selecionar um profissional na lista exibida (passo 2)
4. Selecionar uma data no campo de data (passo 3)
5. Selecionar um horário no seletor de horários
6. Opcionalmente preencher o campo de observações
7. Clicar em "Confirmar agendamento"
8. Observar a tela de sucesso com o nome do médico e a data formatada

**Resultado esperado:**
- A grade de especialidades exibe as especialidades disponíveis com a contagem de profissionais
- Ao selecionar a especialidade, a lista de profissionais aparece
- O botão "Confirmar agendamento" fica habilitado somente após preencher especialidade, médico, data e horário
- A chamada `POST /appointments/createAppointment` é disparada
- A tela de sucesso exibe o médico e a data/hora confirmados

**Mídia:** [▶ Cenário 1](assets/frontend/cenarios-de-teste/cenario-de-teste-1.mp4)

---

### Cenário 2 — Botão de confirmação desabilitado com campos incompletos

**RF-001:** Validação do formulário de agendamento

**Componente:** `ScheduleView`

**Objetivo:** Demonstrar que o botão "Confirmar agendamento" permanece desabilitado enquanto especialidade, profissional, data ou horário não estiverem preenchidos.

**Pré-condição:** Usuário autenticado na tela de agendamento.

**Passos:**
1. Acessar a tela "Agendar"
2. Observar o botão "Confirmar agendamento" desabilitado
3. Selecionar somente a especialidade — verificar que o botão continua desabilitado
4. Selecionar o profissional — verificar que o botão continua desabilitado
5. Preencher a data — verificar que o botão continua desabilitado
6. Selecionar o horário — verificar que o botão é habilitado

**Resultado esperado:**
- O botão "Confirmar agendamento" só é habilitado quando especialidade, profissional, data e horário estão preenchidos
- Nenhuma requisição é enviada enquanto o formulário está incompleto

**Mídia:** [▶ Cenário 2](assets/frontend/cenarios-de-teste/cenario-de-teste-2.mp4)

---

### Cenário 3 — Novo agendamento após sucesso e navegação para consultas

**RF-001:** Fluxo pós-agendamento

**Componente:** `ScheduleView`

**Objetivo:** Demonstrar que após a tela de sucesso o usuário pode iniciar um novo agendamento ou navegar diretamente para "Minhas consultas".

**Pré-condição:** Usuário autenticado. Agendamento concluído com sucesso (cenário 1 executado).

**Passos:**
1. Na tela de sucesso, clicar em "Novo agendamento"
2. Verificar que o formulário é resetado e a tela retorna ao passo 1
3. Concluir um segundo agendamento
4. Na tela de sucesso, clicar em "Ver minhas consultas"
5. Verificar a navegação para a tela de consultas com a nova consulta listada

**Resultado esperado:**
- "Novo agendamento" reseta o formulário completamente
- "Ver minhas consultas" navega para `AppointmentsView` com a lista atualizada via refetch da API

**Mídia:** [▶ Cenário 3](assets/frontend/cenarios-de-teste/cenario-de-teste-3.mp4)

---

## Seção 2 — Visualização de Consultas (AppointmentsView)

Cenários que cobrem a listagem e o detalhamento de consultas, acessível pelo menu lateral "Consultas".

---

### Cenário 4 — Visualizar lista de consultas

**RF-001:** Listagem de consultas

**Componente:** `AppointmentsView`

**Objetivo:** Demonstrar que a tela de consultas exibe corretamente todas as consultas do paciente com data, médico, especialidade, horário e status.

**Pré-condição:** Usuário autenticado com ao menos uma consulta cadastrada.

**Passos:**
1. Clicar em " Minhas Consultas" no menu lateral
2. Observar a lista de consultas com as colunas: data, médico, especialidade, horário, local e status
3. Verificar os chips de status com cores correspondentes (Pendente, Confirmada, Cancelada, Reagendada)

**Resultado esperado:**
- A chamada `GET /appointments/` é disparada ao autenticar
- Todas as consultas são listadas com as informações corretas
- Os chips de status exibem cores distintas por tipo

**Mídia:** [▶ Cenário 4](assets/frontend/cenarios-de-teste/cenario-de-teste-4.mp4)

---

### Cenário 5 — Visualizar detalhes de uma consulta

**RF-001:** Detalhe de consulta

**Componente:** `AppointmentsView` → `AppointmentDetail`

**Objetivo:** Demonstrar que ao clicar em "Detalhes" o sistema exibe uma tela com todas as informações da consulta selecionada.

**Pré-condição:** Pelo menos uma consulta cadastrada na lista.

**Passos:**
1. Na tela "Consultas", clicar no botão "Detalhes" de uma consulta
2. Observar a tela de detalhe com data, horário, especialidade, local e modalidade
3. Verificar o chip de status da consulta
4. Clicar em "Minhas consultas" para retornar à listagem

**Resultado esperado:**
- A tela de detalhe exibe todas as informações da consulta selecionada
- O botão de voltar retorna à lista sem recarregar dados
- Consultas com status `CANCELLED` não exibem os botões de ação (Remarcar / Cancelar)

**Mídia:** [▶ Cenário 5](assets/frontend/cenarios-de-teste/cenario-de-teste-5.mp4)

---

## Seção 3 — Cancelamento de Consulta

Cenários que cobrem o fluxo de cancelamento, acessível pela lista e pela tela de detalhe.

---

### Cenário 6 — Cancelar uma consulta com confirmação

**RF-001:** Cancelamento de consulta

**Componente:** `AppointmentsView` → `CancelConfirmModal`

**Objetivo:** Demonstrar que ao clicar em "Cancelar" o sistema exibe uma modal de confirmação antes de enviar a requisição, e que após a confirmação o status da consulta é atualizado.

**Pré-condição:** Pelo menos uma consulta com status diferente de `CANCELLED`.

**Passos:**
1. Na tela "Consultas", clicar em "Cancelar" em uma consulta ativa
2. Observar a modal de confirmação com as informações da consulta
3. Clicar em "Voltar" — verificar que a modal fecha sem cancelar
4. Clicar novamente em "Cancelar" e desta vez confirmar com "Sim, cancelar consulta"
5. Observar o chip de status da consulta atualizado para "Cancelada"
6. Confirmar na aba Network a chamada `POST /appointments/cancelAppointment`

**Resultado esperado:**
- A modal exibe corretamente o nome do médico, data e horário da consulta
- "Voltar" fecha a modal sem executar nenhuma ação
- Após confirmar, o status da consulta muda para `CANCELLED` imediatamente
- O botão "Cancelar" desaparece da linha da consulta cancelada
- A chamada `POST /appointments/cancelAppointment` é disparada com o ID correto

**Mídia:** [▶ Cenário 6](assets/frontend/cenarios-de-teste/cenario-de-teste-6.mp4)

---

### Cenário 7 — Cancelar uma consulta a partir da tela de detalhe

**RF-001:** Cancelamento de consulta via detalhe

**Componente:** `AppointmentDetail` → `CancelConfirmModal`

**Objetivo:** Demonstrar que o cancelamento também pode ser iniciado a partir da tela de detalhe, com o mesmo fluxo de confirmação e feedback de erro visível na tela de detalhe caso a operação falhe.

**Pré-condição:** Pelo menos uma consulta ativa. Usuário na tela de detalhe de uma consulta.

**Passos:**
1. Na tela "Consultas", clicar em "Detalhes" de uma consulta ativa
2. Na tela de detalhe, clicar em "Cancelar consulta"
3. Confirmar na modal com "Sim, cancelar consulta"
4. Observar o chip de status atualizado para "Cancelada" na tela de detalhe
5. Verificar que os botões de ação (Remarcar / Cancelar) desaparecem

**Resultado esperado:**
- A modal de confirmação é exibida corretamente a partir da tela de detalhe
- Após confirmação, o status é atualizado na tela de detalhe sem retornar à lista
- Em caso de erro na requisição, a mensagem de erro é exibida na tela de detalhe (não apenas na listagem)

**Mídia:** [▶ Cenário 7](assets/frontend/cenarios-de-teste/cenario-de-teste-7.mp4)