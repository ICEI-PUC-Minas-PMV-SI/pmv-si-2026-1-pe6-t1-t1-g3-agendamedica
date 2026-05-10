# Cenários de Teste — Gestão de Agendamentos Frontend (RF-002)

## Contexto

Este documento descreve os cenários de teste para a interface web de gestão de agendamentos do MedHub, implementada no RF-002. Cada cenário cobre um comportamento visual isolado, com passos numerados e resultado esperado para demonstração em print.

**Requisito funcional:** RF-002 — O sistema deve permitir que médicos e recepcionistas gerenciem a agenda de marcações através da interface web.

**URL local:** `http://localhost:5173`

**Autenticação:** fazer login como Recepcionista ou Médico antes de iniciar os cenários.

---

## Ferramentas utilizadas

| Ferramenta             | O que é                                          | Por que usamos                                                                                                              |
| ---------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Navegador**          | Chrome ou Firefox                                | Executar a aplicação e capturar os cenários                                                                                 |
| **Mock Server**        | Servidor Express local (`mock-server/server.js`) | Substitui o backend real em desenvolvimento — serve as consultas simuladas e lida com mudança de status.                    |

---

## Pré-requisitos

1. Instalar dependências em `src/web/`: `npm install`
2. Iniciar o mock server: `node mock-server/server.js` (porta 3001)
3. Iniciar o frontend: `npm run dev` (porta 5173)

---

## Seção 1 — Visão do Médico

---

### Cenário 1 — Médico visualizando sua agenda sem poder criar agendamentos

**RF-002:** Gestão da agenda via interface (Visão Médico)

**Componente:** `HomeView` e `AppointmentsView`

**Objetivo:** Demonstrar que a interface restringe a criação de consultas para Médicos e exibe o nome dos pacientes nas listagens.

**Pré-condição:** Autenticado como Médico (`role: DOCTOR`).

**Passos:**
1. Acessar a tela inicial (`/`) do sistema
2. Observar a ausência do botão "Agendar Consulta" no menu lateral
3. Verificar a seção "Próximas consultas" e ler o nome do paciente exibido nos cartões
4. Clicar em "Consultas" no menu lateral
5. Clicar em "Detalhes" de uma consulta e verificar as restrições de ações permitidas

**Resultado esperado:**
- A interface oculta atalhos de novo agendamento
- O nome do paciente (`patientName`) é exibido corretamente no lugar do nome do médico
- As permissões de gestão (cancelar, reagendar) refletem as restrições do perfil médico

**Mídia:**
![Listagem de agendamentos para médico](./assets/img/frontend-listagem-agendamentos-doctor.png)

![Detalhes de agendamento para médico](./assets/img/frontend-detalhes-agendamento-doctor.png)

---

## Seção 2 — Visão da Recepção

---

### Cenário 2 — Recepção criando um agendamento para terceiro

**RF-002:** Gestão da agenda via interface (Visão Recepção)

**Componente:** `ScheduleView`

**Objetivo:** Demonstrar que a recepção possui fluxo adaptado, permitindo selecionar pacientes e agendar sem bloqueio de antecedência.

**Pré-condição:** Autenticado como Recepcionista (`role: RECEPTIONIST`).

**Passos:**
1. Clicar em "Agendar" no menu lateral
2. Selecionar um paciente na listagem do "Passo 1"
3. Prosseguir até a etapa de seleção de horário
4. Escolher um horário com menos de 4 horas de antecedência
5. Clicar para finalizar o agendamento

**Resultado esperado:**
- O fluxo permite a escolha de pacientes válidos
- A trava de 4 horas de antecedência é ignorada para este perfil
- A consulta é registrada com sucesso na agenda

**Mídia:**
![Listagem de agendamentos autenticado como recepcionista](./assets/img/frontend-agenda-recepcionista.png)

![Detalhes de agendamento para recepcionista](./assets/img/frontend-detalhes-agendamento-recepcionista.png)