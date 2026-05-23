# Cenários de Teste — Login e Cadastro (RF-005) — Mobile

## Contexto

Este documento descreve os cenários de teste para as telas de login e cadastro do MedHub no aplicativo mobile (React Native + Expo). Os testes validam o fluxo completo desde a entrada de dados no dispositivo até a persistência (ou erro) via API, garantindo que o controle de acesso e a criação de perfis funcionem conforme a regra de negócio.

**Requisito funcional (RF-005):** O sistema deve permitir o cadastro e o login de usuários (pacientes), garantindo um único cadastro por CPF e por e-mail.

**App mobile:** Expo Go (SDK 52)  
**Base API:** `http://<IP-do-servidor>:3000/auth`

> O app mobile suporta apenas o perfil **Paciente**. Cadastros de médicos e recepcionistas são realizados via painel web.

---

## Ferramentas utilizadas

| Ferramenta        | O que é                     | Por que usamos                                           |
| ----------------- | --------------------------- | -------------------------------------------------------- |
| **Expo Go**       | App de desenvolvimento Expo | Executar o aplicativo em dispositivo físico ou emulador  |
| **Metro Bundler** | Servidor de desenvolvimento | Visualizar logs de erro e requisições no terminal        |
| **Prisma Studio** | Interface de banco de dados | Confirmar criação de registros e hash de senhas no banco |

---

## Pré-requisitos

1. Backend operacional na porta 3000 (`npm run dev` em `src/backend`).
2. Banco de dados sincronizado (`npx prisma migrate dev`).
3. Expo iniciado (`npx expo start`) com dispositivo na mesma rede Wi-Fi.
4. App **Expo Go** instalado no dispositivo (versão 2.32.x para SDK 52).

---

## Seção 1 — Fluxo de Autenticação (Login)

### Cenário 1 — Login com credenciais válidas (Paciente)

**RF-005:** Autenticação de usuário.  
**Passos:**

1. Abrir o app e acessar a tela de login (`/auth/login`).
2. Inserir e-mail "marianasilva@gmail.com" e senha "Mari123" de um paciente cadastrado.
3. Tocar em **Entrar**.

**Resultado esperado:** Redirecionamento automático para a aba principal `/(tabs)`. Token salvo no SecureStore do dispositivo.

**Mídia:** [▶CASO 1](./assets/frontend/mobile/Cenário01-TesteMobile.mp4)


---

### Cenário 2 — Login com credenciais inválidas

**RF-005:** Tratamento de erro de credenciais.  
**Passos:**

1. Inserir e-mail ou senha incorretos.
2. Tocar em **Entrar**.

**Resultado esperado:** Mensagem `"Credenciais inválidas"` exibida inline abaixo dos campos. Nenhum redirecionamento ocorre.

**Mídia:** [▶CASO 2](./assets/frontend/mobile/Cenário02-TesteMobile.mp4)

---

## Seção 2 — Fluxo de Registro (Cadastro)

### Cenário 3 — Cadastro de Paciente com sucesso

**RF-005:** Criação de conta de paciente.  
**Passos:**

1. Na tela de login, tocar em **Criar conta**.
2. Preencher Nome, E-mail, CPF (11 dígitos), Senha e Confirmar senha.
3. Tocar em **Criar conta**.

**Resultado esperado:** Login automático e redirecionamento para `/(tabs)`. Usuário criado no banco via `POST /auth/register` com `role: PATIENT`.

**Mídia:** [▶CASO 3](./assets/frontend/mobile/Cenário03-TesteMobile.mp4)

---

### Cenário 4 — Senhas divergentes no cadastro

**RF-005:** Validação de integridade de senha.  
**Passos:**

1. Preencher Senha e Confirmar senha com valores diferentes.
2. Tocar em **Criar conta**.

**Resultado esperado:** Mensagem `"As senhas não coincidem."` exibida no campo Confirmar senha. Nenhuma chamada à API é realizada.

**Mídia:** [▶CASO 4](./assets/frontend/mobile/Cenário04-TesteMobile.mp4)

---

### Cenário 5 — E-mail já cadastrado

**RF-005:** Unicidade de e-mail.  
**Pré-condição:** e-mail já existente no banco.  
**Passos:**

1. Tentar cadastrar com um e-mail já em uso.
2. Tocar em **Criar conta**.

**Resultado esperado:** Mensagem `"E-mail já cadastrado."` exibida abaixo do formulário. 

**Mídia:** [▶CASO 5](./assets/frontend/mobile/Cenário05-TesteMobile.mp4)

---

### Cenário 6 — CPF já cadastrado

**RF-005:** Unicidade de CPF.  
**Pré-condição:** CPF já existente no banco.  
**Passos:**

1. Tentar cadastrar com um CPF já em uso.
2. Tocar em **Criar conta**.

**Resultado esperado:** Mensagem `"CPF já cadastrado."` exibida abaixo do formulário.

**Mídia:** [▶CASO 6](./assets/frontend/mobile/Cenário06-TesteMobile.mp4)

