# Cenários de Teste — Segurança de Agendamentos Frontend (RF-003)

## Contexto

Este documento descreve os cenários de teste para garantir a integridade dos agendamentos no MedHub, impedindo a criação de consultas para usuários inexistentes ou com perfis inválidos.

**Requisito funcional:** RF-003 — O sistema deve impedir o agendamento de consultas sem que o perfil do usuário esteja devidamente cadastrado e validado.

**URL local:** `http://localhost:5173`

**Autenticação:** fazer login como Recepcionista.

---

## Ferramentas utilizadas

| Ferramenta             | O que é                                          | Por que usamos                                                                                                              |
| ---------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Navegador**          | Chrome ou Firefox                                | Executar a aplicação e capturar os cenários                                                                                 |
| **DevTools (Network)** | Aba Network do navegador                         | Confirmar que a busca de pacientes retorna apenas dados de `role: PATIENT`.                                                 |

---

## Pré-requisitos

1. Iniciar o mock server: `node mock-server/server.js` (porta 3001)
2. Iniciar o frontend: `npm run dev` (porta 5173)

---

## Seção 1 — Seleção Segura na Recepção

---

### Cenário 1 — Agendamento atrelado a um perfil existente
**RF-003:** Impedir agendamento de consultas sem perfil validado.

**Componente:** `ScheduleView`

**Objetivo:** Demonstrar que o formulário de agendamento, quando operado por terceiros (recepção), força a seleção de um paciente validado do banco de dados, inviabilizando o agendamento de CPFs "avulsos" na interface de agendamento rápido.

**Pré-condição:** Autenticado como Recepção (`role: RECEPTIONIST`).

**Passos:**
1. Acessar "Agendar".
2. Tentar pular o "Passo 1: Paciente" sem preencher nada.
3. Observar que o formulário restante fica invisível/desabilitado ou que a confirmação final não acende.
4. Selecionar a caixa de listagem de Paciente.
5. Observar que a lista (alimentada por `GET /patients/`) contém apenas usuários legítimos do banco.
6. Selecionar o paciente e prosseguir.

**Resultado esperado:**
- A interface restringe o fluxo. O botão "Confirmar agendamento" fica bloqueado sem um `patientId` selecionado.
- Os dados do paciente listado provêm da base de dados, garantindo que o perfil está cadastrado.

![Seleção de pacientes no registro da consulta](./assets/img/frontend-agendamento-recepcionista-selecao-pacientes.png)
