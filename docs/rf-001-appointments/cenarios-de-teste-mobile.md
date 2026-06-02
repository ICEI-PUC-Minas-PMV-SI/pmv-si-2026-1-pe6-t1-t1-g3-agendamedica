# Cenários de Teste — Agendamento de Consultas Mobile (RF-001)

## Contexto

Este documento descreve os cenários de teste para o aplicativo mobile de agendamento, visualização e cancelamento de consultas do MedHub, implementado no RF-001. Cada cenário cobre um comportamento isolado da interface, com passos numerados e resultado esperado para demonstração em vídeo ou print.

**Requisito funcional:** RF-001 — O sistema deve permitir que pacientes agendem, visualizem e cancelem consultas médicas pelo aplicativo.

**Plataforma:** React Native (Expo) — testado em dispositivo físico ou emulador Android/iOS.

**Autenticação:** fazer login como paciente antes de iniciar os cenários.

---

## Ferramentas utilizadas

| Ferramenta             | O que é                                                          | Por que usamos                                                                                                                   |
| ---------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Expo Go**            | App para executar projetos Expo em dispositivo físico ou emulador | Permite rodar o app sem build nativo, agilizando os testes                                                                      |
| **Backend local**      | API Express rodando em `http://localhost:3000`                    | Fornece dados reais de médicos, consultas e autenticação durante os testes                                                       |
| **Prisma Studio**      | Interface visual para o banco de dados PostgreSQL                 | Permite verificar se as operações (criação, cancelamento) foram persistidas corretamente no banco após cada cenário               |

---

## Pré-requisitos

1. Backend em execução: entrar em `src/backend/` e rodar `npm run dev` (porta 3000)
2. Banco de dados com ao menos um médico cadastrado na tabela `Doctor`
3. Instalar dependências do mobile: `cd src/mobile && npm install`
4. Iniciar o app: `npx expo start` e abrir no dispositivo/emulador via Expo Go
5. Fazer login com um usuário de role `PATIENT` antes de iniciar os cenários

**IDs de exemplo para teste:**

- Patient ID: `a1111111-1111-1111-1111-111111111111`
- Doctor ID: `b2222222-2222-2222-2222-222222222222`
- Appointment ID existente: `fc79785d-dfaf-4617-875b-7f338c03a6d7`

---

## Seção 1 — Agendamento de Consulta (NewAppointmentScreen)

Cenários que cobrem o fluxo de agendamento de nova consulta, acessível pelo botão **+** na tela "Consultas".

---

### Cenário 1 — Agendar uma nova consulta com sucesso

**RF-001:** Agendamento de consulta

**Tela:** `NewAppointmentScreen` (`/appointment/new`)

**Objetivo:** Demonstrar o fluxo completo de agendamento em 3 passos: seleção de médico, data e horário, e confirmação, com exibição do alerta de sucesso e navegação para os detalhes.

**Pré-condição:** Usuário autenticado. Backend em execução com ao menos um médico cadastrado.

**Passos:**
1. Na aba "Consultas", tocar no botão **+** no canto superior direito
2. Observar a barra de progresso com 3 etapas (Passo 1 ativo)
3. **Passo 1 — Médico:** buscar um médico pelo nome ou especialidade no campo de busca
4. Tocar no card do médico desejado — verificar o ícone de seleção (✓) no card
5. Tocar em "Próximo"
6. **Passo 2 — Data e horário:** deslizar o carrossel de datas e selecionar uma data (próximos 14 dias)
7. Selecionar um horário disponível na grade (08:00–17:30, a cada 30 min)
8. Tocar em "Próximo"
9. **Passo 3 — Confirmar:** revisar o resumo com médico, especialidade, data e horário
10. Opcionalmente preencher o campo "Observações"
11. Tocar em "Confirmar"
12. Observar o alerta "Consulta agendada!" com botão "Ver detalhes"
13. Tocar em "Ver detalhes" e verificar a navegação para a tela de detalhes da consulta

**Resultado esperado:**
- A barra de progresso avança a cada passo concluído
- O resumo exibe corretamente médico, especialidade, clínica (se houver), data e horário
- A chamada `POST /appointments/createAppointment` é disparada com os dados corretos
- O alerta de sucesso é exibido após a criação
- A navegação leva para `/appointment/:id` com os dados da consulta recém-criada
- A consulta aparece na aba "Próximas" da listagem

**Mídia:** [▶ Cenário 1](assets\mobile\cenario-de-teste-1.mp4)

---

### Cenário 2 — Botão "Próximo" desabilitado sem médico selecionado

**RF-001:** Validação do passo 1

**Tela:** `NewAppointmentScreen` — Passo 1

**Objetivo:** Demonstrar que não é possível avançar do passo 1 sem selecionar um médico.

**Pré-condição:** Usuário na tela de novo agendamento, passo 1.

**Passos:**
1. Abrir a tela de novo agendamento
2. Observar o botão "Próximo" desabilitado
3. Digitar algo no campo de busca — verificar que o botão permanece desabilitado
4. Selecionar um médico — verificar que o botão "Próximo" é habilitado

**Resultado esperado:**
- O botão "Próximo" permanece desabilitado enquanto nenhum médico estiver selecionado
- Nenhuma requisição é enviada ao servidor neste passo
- Ao selecionar um médico, o botão é habilitado imediatamente

**Mídia:** [▶ Cenário 2](assets\mobile\cenario-de-teste-2.mp4)

---

### Cenário 3 — Botão "Próximo" desabilitado sem data e horário selecionados

**RF-001:** Validação do passo 2

**Tela:** `NewAppointmentScreen` — Passo 2

**Objetivo:** Demonstrar que não é possível avançar do passo 2 sem selecionar data e horário.

**Pré-condição:** Médico selecionado no passo 1, usuário no passo 2.

**Passos:**
1. No passo 2, observar o botão "Próximo" desabilitado
2. Selecionar uma data no carrossel — verificar que o botão continua desabilitado (a grade de horários aparece)
3. Selecionar um horário na grade — verificar que o botão "Próximo" é habilitado
4. Trocar a data — verificar que o horário é desmarcado e o botão volta a ser desabilitado

**Resultado esperado:**
- A grade de horários só aparece após selecionar uma data
- O botão "Próximo" exige data **e** horário selecionados
- Trocar a data desmarca o horário anteriormente selecionado

**Mídia:** [▶ Cenário 3](assets\mobile\cenario-de-teste-3.mp4)

---

## Seção 2 — Visualização de Consultas (AppointmentsScreen)

Cenários que cobrem a listagem e o detalhamento de consultas, acessível pela aba "Consultas".

---

### Cenário 4 — Visualizar lista de consultas com filtros

**RF-001:** Listagem de consultas

**Tela:** `AppointmentsScreen` (`/(tabs)/appointments`)

**Objetivo:** Demonstrar que a tela exibe os agendamentos do paciente organizados por filtro, com as informações corretas em cada card.

**Pré-condição:** Usuário autenticado com ao menos uma consulta em cada estado (futura, passada, cancelada).

**Passos:**
1. Tocar na aba "Consultas" na barra de navegação inferior
2. Observar a lista carregada no filtro "Próximas" (padrão)
3. Verificar que cada card exibe: médico, especialidade, data, horário e badge de status
4. Tocar no filtro "Realizadas" — verificar que apenas consultas passadas e não canceladas são exibidas
5. Tocar no filtro "Canceladas" — verificar que apenas consultas com status `CANCELLED` são exibidas
6. Tocar novamente em "Próximas" para retornar ao filtro padrão

**Resultado esperado:**
- A chamada `GET /appointments/listAppointments?userId=...` é disparada ao entrar na aba
- Filtro "Próximas": exibe consultas com data ≥ hoje e status `PENDING`, `CONFIRMED` ou `RESCHEDULED`, ordenadas por data crescente
- Filtro "Realizadas": exibe consultas com data < hoje e status diferente de `CANCELLED`, ordenadas por data decrescente
- Filtro "Canceladas": exibe consultas com status `CANCELLED`, ordenadas por data decrescente
- Os badges de status exibem cores distintas por tipo

**Mídia:** [▶ Cenário 4](assets\mobile\cenario-de-teste-4.mp4)

---

### Cenário 5 — Pull-to-refresh na lista de consultas

**RF-001:** Atualização da listagem

**Tela:** `AppointmentsScreen`

**Objetivo:** Demonstrar que o gesto de arrastar para baixo (pull-to-refresh) recarrega a lista do servidor.

**Pré-condição:** Usuário na tela "Consultas" com ao menos uma consulta listada.

**Passos:**
1. Na tela "Consultas", arrastar a lista para baixo para acionar o pull-to-refresh
2. Observar o indicador de carregamento (spinner)
3. Aguardar a lista ser recarregada com os dados atualizados

**Resultado esperado:**
- O gesto pull-to-refresh aciona nova chamada `GET /appointments/listAppointments?userId=...`
- O indicador de carregamento é exibido durante a requisição
- A lista é atualizada sem recarregar toda a tela

**Mídia:** [▶ Cenário 5](assets\mobile\cenario-de-teste-5.mp4)

---

### Cenário 6 — Estado vazio sem consultas agendadas

**RF-001:** Listagem vazia

**Tela:** `AppointmentsScreen`

**Objetivo:** Demonstrar que a tela exibe uma mensagem amigável e atalho para agendar quando não há consultas no filtro ativo.

**Pré-condição:** Usuário autenticado sem consultas futuras cadastradas.

**Passos:**
1. Entrar na aba "Consultas" com o filtro "Próximas" ativo
2. Observar a mensagem "Nenhuma consulta" com o texto "Você não tem consultas agendadas."
3. Verificar o botão "Agendar consulta" no estado vazio
4. Tocar em "Agendar consulta" — verificar a navegação para `/appointment/new`

**Resultado esperado:**
- O estado vazio exibe mensagem contextual de acordo com o filtro ativo
- No filtro "Próximas", o botão "Agendar consulta" é exibido como atalho
- Nos filtros "Realizadas" e "Canceladas", nenhum botão de ação é exibido no estado vazio
- O botão "Agendar consulta" navega corretamente para o fluxo de novo agendamento

**Mídia:** [▶ Cenário 6](assets\mobile\cenario-de-teste-6.mp4)

---

### Cenário 7 — Visualizar detalhes de uma consulta

**RF-001:** Detalhe de consulta

**Tela:** `AppointmentDetailScreen` (`/appointment/[id]`)

**Objetivo:** Demonstrar que ao tocar em um card de consulta o sistema exibe uma tela com todas as informações detalhadas.

**Pré-condição:** Ao menos uma consulta cadastrada na lista.

**Passos:**
1. Na aba "Consultas", tocar em um card de consulta
2. Observar a tela de detalhe com o badge de status no topo
3. Verificar o card de informações com: médico, especialidade, data, horário e clínica (se houver)
4. Verificar o card de observações (se a consulta tiver notas)
5. Tocar em "Voltar" no header para retornar à listagem

**Resultado esperado:**
- A chamada `GET /appointments/:id` é disparada ao abrir a tela
- O nome do médico e a especialidade são exibidos corretamente (não "Não informado")
- A data e o horário são formatados em português (ex: "quinta-feira, 10 de abril", "14:00")
- O badge de status exibe a cor correspondente ao estado da consulta
- O card de observações só aparece quando a consulta possui notas preenchidas

**Mídia:** [▶ Cenário 7](assets\mobile\cenario-de-teste-7.mp4)

---

## Seção 3 — Cancelamento de Consulta

Cenários que cobrem o fluxo de cancelamento, acessível a partir da tela de detalhes.

---

### Cenário 8 — Cancelar consulta com confirmação via alerta

**RF-001:** Cancelamento de consulta

**Tela:** `AppointmentDetailScreen`

**Objetivo:** Demonstrar que ao tocar em "Cancelar consulta" o sistema exibe um alerta de confirmação antes de enviar a requisição, e que após a confirmação o status é atualizado na tela.

**Pré-condição:** Consulta com status `PENDING` ou `CONFIRMED` aberta na tela de detalhes.

**Passos:**
1. Na tela de detalhes de uma consulta ativa, observar o botão "Cancelar consulta"
2. Tocar em "Cancelar consulta"
3. Observar o alerta "Cancelar consulta" com opções "Não" e "Sim, cancelar"
4. Tocar em "Não" — verificar que o alerta fecha sem alteração
5. Tocar novamente em "Cancelar consulta" e desta vez confirmar com "Sim, cancelar"
6. Observar o badge de status atualizado para "Cancelada" na mesma tela
7. Verificar que o botão "Cancelar consulta" desaparece após o cancelamento

**Resultado esperado:**
- O alerta exibe as opções "Não" (estilo cancel) e "Sim, cancelar" (estilo destructive)
- "Não" fecha o alerta sem executar nenhuma ação
- "Sim, cancelar" dispara a chamada `POST /appointments/cancelAppointment` com o ID correto
- O status é atualizado para `CANCELLED` imediatamente na tela, sem recarregar
- O botão "Cancelar consulta" desaparece após o status mudar para `CANCELLED`
- A consulta aparece no filtro "Canceladas" ao retornar à listagem

**Mídia:** [▶ Cenário 8](assets\mobile\cenario-de-teste-8.mp4)

---

### Cenário 9 — Botão "Cancelar" não exibido para consultas já canceladas

**RF-001:** Regra de negócio — cancelamento

**Tela:** `AppointmentDetailScreen`

**Objetivo:** Demonstrar que consultas com status `CANCELLED` não exibem o botão de cancelamento.

**Pré-condição:** Ao menos uma consulta com status `CANCELLED` cadastrada.

**Passos:**
1. Na aba "Consultas", tocar no filtro "Canceladas"
2. Tocar em um card de consulta cancelada
3. Observar a tela de detalhes da consulta cancelada
4. Verificar que o badge exibe "Cancelada"
5. Verificar que o botão "Cancelar consulta" **não** é exibido

**Resultado esperado:**
- O badge de status exibe "Cancelada"
- O botão "Cancelar consulta" não é renderizado para consultas com status `CANCELLED`
- Consultas com status `RESCHEDULED` ou `PENDING` ainda exibem o botão normalmente

**Mídia:** [▶ Cenário 9](assets\mobile\cenario-de-teste-9.mp4)
