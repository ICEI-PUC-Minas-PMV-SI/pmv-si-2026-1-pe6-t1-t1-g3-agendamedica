# Cenários de Teste — Login e Cadastro (RF-005)

## Contexto

Este documento descreve os cenários de teste para as interfaces de login e cadastro do MedHub, consolidadas no **RF-005**. Os testes validam o fluxo completo desde a entrada de dados no frontend até a persistência (ou erro) via API, garantindo que o controle de acesso e a criação de perfis (médico/paciente) funcionem conforme a regra de negócio.

**Requisito funcional (RF-005):** O sistema deve permitir o cadastro e o login de todos os usuários (pacientes, médicos e recepcionistas), garantindo um único cadastro por CPF e por e-mail.

**URL local:** `http://localhost:5173`
**Base API:** `http://localhost:3000/auth`

---

## Ferramentas utilizadas

| Ferramenta             | O que é                  | Por que usamos                                                             |
| ---------------------- | ------------------------ | -------------------------------------------------------------------------- |
| **Navegador**          | Chrome ou Firefox        | Executar a interface web e validar a experiência do usuário (UX).          |
| **DevTools (Network)** | Aba Network do navegador | Validar o status code das requisições (200, 401, 400) e os payloads JSON.  |
| **Prisma Studio**      | Interface de DB          | Confirmar a criação de registros e a correta aplicação de hash nas senhas. |

---

## Pré-requisitos

1. Backend operacional na porta 3000.
2. Frontend (Vite/React) operacional na porta 5173.
3. Banco de dados sincronizado (Prisma).

---

## Seção 1 — Fluxo de Autenticação (Login)

### Cenário 1 — Login com credenciais válidas (Médico)

**RF-005:** Autenticação de usuário.
**Passos:**

1. Acessar a tela de login.
2. Inserir e-mail `marthinha123@gmail.com` e senha `Martha123`.
3. Clicar em **Entrar**.
**Resultado esperado:** Redirecionamento para `HomeView`. Validação do perfil do usuário na interface. Chamada `POST /auth/login` retorna `200 OK`.

**Mídia:** [▶CASO 1](./assets/frontend/caso01.mp4)


### Cenário 2 — Login com credenciais válidas (Médico)

**RF-005:** Autenticação de profissional.
**Passos:**

1. Acessar a tela de login.
2. Inserir e-mail `elizandraasouza@gmail.com` e senha `Eli123`.
3. Clicar em **Entrar**.
**Resultado esperado:** Redirecionamento para `DoctorDashboard`. Validação de CRM e especialidade na interface. Chamada `POST /auth/login` retorna `200 OK`.

**Mídia:** [▶CASO 2](./assets/frontend/caso02.mp4)


### Cenário 3 — Login com falha (Senha incorreta ou E-mail inexistente)

**RF-005:** Tratamento de erro de credenciais.
**Passos:**

1. Inserir e-mail `elizandrasouz@gmail.com` ou senha `Eli456`.
2. Clicar em **Entrar**.
**Resultado esperado:** Mensagem `"Credenciais inválidas"` exibida via Toast/Alert. Resposta `401 Unauthorized` na aba Network.

**Mídia:** [▶CASO 3](./assets/frontend/caso03.mp4)

---

## Seção 2 — Fluxo de Registro (Cadastro)

### Cenário 4 — Cadastro de Paciente com sucesso

**RF-005:** Criação de conta de paciente.
**Passos:**

1. No formulário de cadastro, preencher Nome, CPF `98765432300`, E-mail `eudessilva@gmail.com` e Senha.
2. Clicar em **Criar conta**.
**Resultado esperado:** Mensagem de sucesso. Redirecionamento para Login após 2s. Usuário persistido no banco via `POST /auth/register`.

**Mídia:** [▶CASO 3](./assets/frontend/caso04.mp4)

### Cenário 5 — Cadastro de Médico com sucesso

**RF-005:** Criação de conta profissional.
**Passos:**

1. Alternar para visão "Para profissionais".
2. Preencher CRM `654321/RJ` e Especialidade `Neurologia`, além dos dados básicos.
3. Clicar em **Cadastrar como médico**.
**Resultado esperado:**  Mensagem de sucesso. Redirecionamento para Login após 2s. Médico(a) persistido no banco via `POST /auth/register`.

**Mídia:** [▶CASO 5](./assets/frontend/caso05.mp4)

---

## Seção 3 — Validações de Interface

### Cenário 6 — Validação de integridade (Senhas e CPF)

**RF-005:** Bloqueio de dados inconsistentes.
**Passos:**

1. Preencher senhas divergentes ou CPF com < 11 dígitos.
2. Tentar submeter o formulário.
**Resultado esperado:** Mensagens `"As senhas não coincidem"` ou `"CPF inválido"` aparecem antes de qualquer chamada à API. 

**Mídia:** [▶CASO 6](./assets/frontend/caso06.mp4)