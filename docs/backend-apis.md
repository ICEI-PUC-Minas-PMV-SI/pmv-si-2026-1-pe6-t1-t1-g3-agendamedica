# APIs e Web Services

O MedHub é uma plataforma de agendamento médico que conecta pacientes e profissionais de saúde de forma simples, prática e organizada. A solução permite que médicos se cadastrem e disponibilizem horários de atendimento, enquanto pacientes podem consultar essas informações e realizar agendamentos.

O sistema é estruturado em uma arquitetura distribuída, na qual cada componente possui responsabilidades bem definidas: interface com o usuário, processamento das regras de negócio e armazenamento dos dados. A comunicação entre a interface web e o banco de dados é realizada por meio de API, assegurando o armazenamento e o gerenciamento seguro de todas as informações.
O objetivo do MedHub é otimizar o processo de agendamento, contribuindo para a satisfação do usuário e proporcionando uma gestão mais eficiente das agendas dos profissionais de saúde.

## Objetivos da API

A API do MedHub tem como objetivo centralizar e controlar toda a comunicação entre as aplicações clientes web e mobile, além do banco de dados, sendo o único ponto de entrada para os dados do sistema. A API deve atender exclusivamente os frontends do próprio MedHub (React e React Native), não sendo exposta a clientes externos.

**Os recursos que a API deve fornecer são:**

- **Autenticação e autorização** de usuários (pacientes, médicos e recepcionistas) via JWT, garantindo acesso seguro e controlado por perfil.
- **Gestão de usuários**, incluindo cadastro, login e recuperação de senha, com validação de CPF e e-mail únicos.
- **Gestão de médicos e clínicas**, permitindo cadastro, atualização e vinculação de profissionais a clínicas.
- **Gestão de serviços e horários**, permitindo que médicos cadastrem os serviços oferecidos e disponibilizem horários de atendimento.
- **Gestão de agendamentos**, permitindo que pacientes agendem, visualizem e cancelem consultas, com prevenção de conflitos de horário.
- **Notificações**, disparando alertas aos usuários em confirmações, alterações e cancelamentos de consultas.

## Modelagem da Aplicação
[Descreva a modelagem da aplicação, incluindo a estrutura de dados, diagramas de classes ou entidades, e outras representações visuais relevantes.]


## Tecnologias Utilizadas

A seguir, as tecnologias definidas para serem utilizadas no desenvolvimento do projeto.

| Camada          | Tecnologias                                                              |
| --------------- | ------------------------------------------------------------------------ |
| Backend         | Node.js · Express.js · TypeScript · Prisma ORM · JWT · Zod · Nodemailer  |
| Banco de dados  | PostgreSQL                                                               |
| Frontend Web    | React · Vite · TypeScript · React Router · Axios · Tailwind CSS          |
| Frontend Mobile | React Native · Expo · TypeScript · Expo Router · Expo Push Notifications |

## API Endpoints

[Liste os principais endpoints da API, incluindo as operações disponíveis, os parâmetros esperados e as respostas retornadas.]

### Endpoint 1 - Cadastro de Usuário
- Método: POST
- URL: /auth/register
- Parâmetros:

| Campo       | Tipo   | Descrição                                                |
| ----------- | ------ | -------------------------------------------------------- |
| `name`      | string | Nome completo do usuário                                 |
| `email`     | string | E-mail único do usuário                                  |
| `cpf`       | string | CPF único do usuário (11 dígitos)                        |
| `password`  | string | Senha do usuário                                         |
| `role`      | string | Tipo de usuário: `PATIENT`, `DOCTOR` ou `RECEPTIONIST`   |
| `specialty` | string | Especialidade médica, obrigatório se `role` for `DOCTOR` |
| `crm`       | string | CRM do médico, obrigatório se `role` for `DOCTOR`        |

- **Respostas:**
 
  - **Sucesso (201 Created):**
 
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "PATIENT"
}
```
 
  - **Erro (400 Bad Request):**
 
```json
{
  "message": "E-mail já cadastrado"
}
```
 
```json
{
  "message": "CPF já cadastrado"
}
```
 
---
 
### Endpoint 2 — Login
 
- Método: POST
- URL: /auth/login
- Parâmetros:
 
| Campo      | Tipo   | Descrição         |
| ---------- | ------ | ----------------- |
| `email`    | string | E-mail cadastrado |
| `password` | string | Senha do usuário  |
 
- **Respostas:**
 
  - **Sucesso (200 OK):**
 
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "role": "PATIENT"
  }
}
```
 
  - **Erro (401 Unauthorized):**
 
```json
{
  "message": "Credenciais inválidas"
}
```

## Considerações de Segurança

- **Senhas:** As senhas nunca são armazenadas em texto puro. O bcrypt é utilizado para gerar um hash seguro com 10 rounds antes de salvar no banco.
- **Unicidade:** O banco garante um único cadastro por CPF e por e-mail através de constraints @unique no schema do Prisma.

## Implantação

[inserir]

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
