# Cenários de Teste — APIs de Autenticação e Cadastro
 
## Contexto
 
Este documento descreve os cenários de teste para as APIs de autenticação do MedHub. Estes endpoints permitem cadastrar novos usuários (pacientes, médicos ou recepcionistas) e realizar o login para obtenção do token de acesso.
 
- **Base URL:** `http://localhost:3000/auth`
- **Autenticação:** rotas públicas (não exigem header de `Authorization`)
 
---
 
## Ferramentas utilizadas
 
| Ferramenta    | O que é                                           | Por que usamos                                                                                                                                                           |
| :------------ | :------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Postman       | Cliente HTTP para enviar requisições à API        | Permite executar cada cenário de forma isolada e visualizar as respostas com formatação                                                                                  |
| Prisma Studio | Interface visual para o banco de dados PostgreSQL | Permite verificar as mudanças persistidas no banco após cada operação — por exemplo, confirmar que a senha foi gravada como um *hash* criptografado e não em texto limpo |
 
### Por que o Prisma Studio é necessário neste contexto
 
Os endpoints de autenticação interagem com o banco de dados para criar e validar registros. O Prisma Studio permite:
 
- Verificar a criação de novos registros na tabela `User` e na tabela relacionada `Doctor`
- Confirmar que a senha original não está visível no banco (validação do Bcrypt)
- Confirmar que as restrições de unicidade estão sendo respeitadas
 
---
 
## Referência rápida de endpoints
 
| Método | Rota        | Descrição                                |
| :----- | :---------- | :--------------------------------------- |
| `POST` | `/register` | Cadastrar um novo usuário no sistema     |
| `POST` | `/login`    | Autenticar usuário existente e gerar JWT |
 
---
 
## Pré-requisitos
 
Antes de iniciar os cenários, configure o ambiente:
 
- Certifique-se de que o banco (Docker) está rodando e as migrações aplicadas (`npx prisma migrate dev`)
- O arquivo `.env` deve conter chaves válidas para `JWT_SECRET` e `JWT_EXPIRES_IN`
- Para os testes de login, é necessário executar o teste de cadastro primeiro ou ter um usuário pré-existente no banco
 
---
 
## Endpoints Disponíveis
 
### `POST /register` — Criar Usuário
 
Cria um novo usuário. Se a role for `DOCTOR`, cria também o registro do médico associado.
 
**Body (JSON):**
 
```json
{
  "name": "string",
  "email": "string (formato de e-mail)",
  "cpf": "string (mínimo 11 caracteres)",
  "password": "string (mínimo 6 caracteres)",
  "role": "PATIENT | DOCTOR | RECEPTIONIST",
  "specialty": "string (obrigatório se role for DOCTOR)",
  "crm": "string (obrigatório se role for DOCTOR)"
}
```
 
**Respostas:**
 
`201 Created` — Usuário criado com sucesso
 
```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "role": "PATIENT | DOCTOR | RECEPTIONIST"
}
```
 
`400 Bad Request` — Erro de validação Zod ou regra de negócio (e-mail/CPF duplicado)
 
```json
{
  "error": "Mensagem de erro ou objeto detalhado"
}
```
 
---
 
### `POST /login` — Autenticar Usuário
 
Valida as credenciais do usuário e retorna um token de acesso (JWT).
 
**Body (JSON):**
 
```json
{
  "email": "string (formato de e-mail)",
  "password": "string"
}
```
 
**Respostas:**
 
`200 OK` — Login realizado com sucesso
 
```json
{
  "token": "string (JWT Token)",
  "user": {
    "id": "string (UUID)",
    "name": "string",
    "role": "PATIENT | DOCTOR | RECEPTIONIST"
  }
}
```
 
`401 Unauthorized` — Credenciais inválidas
 
```json
{
  "error": "Credenciais inválidas"
}
```
 
---
 
## Cenários de Teste
 
### Cenário 1 — Criar cadastro de médico
 
> **Rota:** `POST /register`  
> **Objetivo:** Demonstrar que a API cria o usuário com regra específica de médico no banco e retorna os dados parciais.
 
**Requisição:**
 
```http
POST /auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json
 
{
    "name": "Dra. Ana Beatriz",
    "email": "ana.beatriz@medhub.app",
    "cpf": "99988877766",
    "password": "senhaSegura123",
    "role": "DOCTOR",
    "specialty": "Pediatria",
    "crm": "CRM-45678"
}
```
 
**Resposta esperada — `201 Created`:**
 
```json
{
    "id": "uuid-gerado-pelo-banco",
    "name": "Dra. Ana Beatriz",
    "email": "ana.beatriz@medhub.app",
    "role": "DOCTOR"
}
```
**Evidência — Postman**
!['Cenário 1 — Criar cadastro de médico'](.\assets\backend\cenarios-de-teste\Cenário_01.png)

**Evidência — Prisma Studio**
!['Evidência de criptografia - Prisma'](.\assets\backend\cenarios-de-teste\Evidencia_01_Prisma.png)

---
 
### Cenário 2 — Autenticar usuário com sucesso (Login)
 
> **Rota:** `POST /login`  
> **Objetivo:** Demonstrar que a API valida as credenciais corretamente e emite o token JWT.
 
**Requisição:**
 
```http
POST /auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json
 
{
    "email": "ana.beatriz@medhub.app",
    "password": "senhaSegura123"
}
```
 
**Resposta esperada — `200 OK`:**
 
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZ...",
    "user": {
        "id": "uuid-do-banco",
        "name": "Dra. Ana Beatriz",
        "role": "DOCTOR"
    }
}
```
**Evidência — Postman**
!['Cenário 2 — Autenticar usuário com sucesso (Login)'](.\assets\backend\cenarios-de-teste\Cenário_02.png)
 
---
 
### Cenário 3 — Erro de validação de Schema
 
> **Rota:** `POST /register`  
> **Objetivo:** Demonstrar o tratamento de erros quando parâmetros obrigatórios baseados na regra de negócio estão ausentes (ex: cadastrar médico sem CRM).
 
**Requisição:**
 
```http
POST /auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json
 
{
    "name": "Dr. Carlos",
    "email": "carlos@medhub.app",
    "cpf": "11122233344",
    "password": "senha123",
    "role": "DOCTOR"
}
```
 
**Resposta esperada — `400 Bad Request`:**
 
```json
{
    "error": {
        "formErrors": [],
        "fieldErrors": {
            "specialty": [
                "Especialidade e CRM são obrigatórios para médicos"
            ]
        }
    }
}
```
**Evidência — Postman**
!['Cenário 3 — Erro de validação de Schema'](.\assets\backend\cenarios-de-teste\Cenário_03.png)
 
---
 
### Cenário 4 — Erro de Credenciais (Não Autorizado)
 
> **Rota:** `POST /login`  
> **Objetivo:** Demonstrar que a API bloqueia o acesso e retorna status 401 caso a senha ou o e-mail estejam incorretos.
 
**Requisição:**
 
```http
POST /auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json
 
{
    "email": "ana.beatriz@medhub.app",
    "password": "senhaIncorretaAqui"
}
```
 
**Resposta esperada — `401 Unauthorized`:**
 
```json
{
    "error": "Credenciais inválidas"
}
```
**Evidência — Postman**
!['Cenário 4 - Erro de Credenciais (Não Autorizado)'](.\assets\backend\cenarios-de-teste\Cenário_04.png)

### Cenário 5 — Criar cadastro com sucesso (Paciente)
 
> **Rota:** `POST /register`  
> **Objetivo:** Demonstrar que a API cria um usuário com role `PATIENT` sem exigir campos exclusivos de médico (`specialty` e `crm`).
 
**Requisição:**
 
```http
POST /auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json
 
{
    "name": "Beatriz Siqueira",
    "email": "beatriz.siqueira@medhub.app",
    "cpf": "19189234569",
    "password": "senhaSegura123",
    "role": "PATIENT"
}
```
 
**Resposta esperada — `201 Created`:**
 
```json
{
    "id": "UID gerado pelo banco",
    "name": "Beatriz Siqueira",
    "email": "beatriz.siqueira@medhub.app",
    "role": "PATIENT"
}
```
**Evidência — Postman**
['Cenário 5 — Criar cadastro com sucesso (Paciente)'](.\assets\backend\cenarios-de-teste\Cenário_05.png)

**Evidência — Prisma Studio**
['Evidência de Cadastro e Criptografia - Prisma'](.\assets\backend\cenarios-de-teste\Evidencia_02_Prisma.png)
 
---
 
### Cenário 6 — Criar cadastro com sucesso (Recepcionista)
 
> **Rota:** `POST /register`  
> **Objetivo:** Demonstrar que a API cria um usuário com role `RECEPTIONIST` sem exigir campos exclusivos de médico (`specialty` e `crm`).
 
**Requisição:**
 
```http
POST /auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json
 
{
    "name": "Mariana Costa",
    "email": "mariana.costa@medhub.app",
    "cpf": "98765432145",
    "password": "senhaSegura123",
    "role": "RECEPTIONIST"
}
```
 
**Resposta esperada — `201 Created`:**
 
```json
{
    "id": "uuid-gerado-pelo-banco",
    "name": "Mariana Costa",
    "email": "mariana.costa@medhub.app",
    "role": "RECEPTIONIST"
}
```
**Evidência — Postman**
['Cenário 6 — Criar cadastro com sucesso (Recepcionista)'](.\assets\backend\cenarios-de-teste\Cenário_06.png)
 
**Evidência — Prisma Studio**
['Evidência de Cadastro e Criptografia - Prisma'](.\assets\backend\cenarios-de-teste\Evidencia_03_Prisma.png)
---
 
### Cenário 7 — Erro de e-mail duplicado
 
> **Rota:** `POST /register`  
> **Objetivo:** Demonstrar que a API rejeita o cadastro quando o e-mail informado já está em uso, respeitando a restrição de unicidade do banco.
 
**Pré-condição:** o e-mail `beatriz.siqueira@medhub.app` já está cadastrado (Cenário 5).
 
**Requisição:**
 
```http
POST /auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json
 
{
    "name": "Beatriz Silva Siqueira",
    "email": "beatriz.siqueira@medhub.app",
    "cpf": "00011122233",
    "password": "outraSenha123",
    "role": "PATIENT"
}
```
 
**Resposta esperada — `400 Bad Request`:**
 
```json
{
    "error": "E-mail ou CPF já cadastrado"
}
```
**Evidência — Postman**
['Cenário 7 — Erro de e-mail duplicado'](.\assets\backend\cenarios-de-teste\Cenário_07.png)
 
---
 
