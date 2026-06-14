# MEDHUB

`CURSO: Sistemas de Informação`

`DISCIPLINA: Projeto - Arquitetura de Sistemas Distribuídos`

`SEMESTRE: 6º`

O projeto consiste no desenvolvimento de um sistema de Agenda Médica Distribuída que permite o gerenciamento e o agendamento online de consultas entre pacientes e profissionais de saúde. A plataforma possibilita que médicos cadastrem seus horários disponíveis e serviços oferecidos, enquanto os pacientes podem consultar essas informações e realizar agendamentos de forma prática e organizada.

A solução será estruturada com base em uma arquitetura distribuída, na qual diferentes componentes do sistema serão responsáveis por funções específicas, como interface com o usuário, processamento das regras de negócio e armazenamento dos dados. Essa separação contribui para maior organização, escalabilidade e facilidade de manutenção do sistema.

O sistema tem como objetivo otimizar o processo de agendamento, reduzir conflitos de horário e facilitar o acesso dos pacientes às consultas médicas, proporcionando uma gestão mais eficiente das agendas dos profissionais de saúde.
## Integrantes

* [Alice Abreu dos Reis](docs/atas/aluno1.md)
* [Gabriel dos Reis Nascimento](docs/atas/aluno2.md)
* [Martha Beatriz Siqueira da Silva](docs/atas/aluno3.md)
* [Omar Petronilio Martins de Abreu](docs/atas/aluno4.md)
* [Letícia Oliveira Aquino](docs/atas/aluno5.md)

## Orientador

* Kleber Jacques Ferreira de Souza

## 📊 Relatório de Contribuições

Este projeto possui rastreamento automático de contribuições individuais. O relatório é atualizado automaticamente toda segunda-feira e a cada push no repositório.

**[📈 Ver Relatório Completo de Contribuições](docs/CONTRIBUTION_REPORT.md)**

O relatório inclui:
- Commits por autor
- Linhas de código adicionadas/removidas
- Arquivos modificados
- Contribuições em documentação
- Gráficos de participação semanal

# Planejamento

| Etapa         | Atividades |
|  :----:   | ----------- |
| ETAPA 1         |[Documentação de Contexto](docs/contexto.md) <br> |
| ETAPA 2         |[Planejar, desenvolver e gerenciar APIs e Web Services](docs/backend-apis.md) <br> |
| ETAPA 3         |[Planejar, desenvolver e gerenciar uma aplicação Web](docs/frontend-web.md) |
| ETAPA 4        |[Planejar, desenvolver e gerenciar uma aplicação Móvel](docs/frontend-mobile.md) <br>  |
| ETAPA 5         | [Apresentação](presentation/README.md) |

## Instruções de utilização

O projeto é composto por três aplicações independentes: **backend**, **frontend web** e **frontend mobile**. Cada uma deve ser iniciada separadamente.

### Pré-requisitos gerais

| Ferramenta | Versão mínima | Verificar |
| --- | --- | --- |
| Node.js | 22.x LTS | `node -v` |
| npm | 9+ | `npm -v` |
| Docker + Docker Compose | 24+ / v2 | `docker compose version` |

---

### 1. Backend (API REST)

```bash
# Instalar dependências
cd src/backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env e preencha JWT_SECRET e as credenciais SMTP

# Subir o banco de dados PostgreSQL via Docker
docker compose up -d

# Criar as tabelas (migrations Prisma)
npx prisma migrate dev --name init

# Iniciar o servidor em modo desenvolvimento (porta 3000)
npm run dev
```

Confirme que a API está rodando:

```bash
curl http://localhost:3000/health
# Esperado: {"status":"ok"}
```

Para mais detalhes, consulte [`src/backend/SETUP.md`](src/backend/SETUP.md).

---

### 2. Frontend Web

```bash
cd src/web
npm install

# Iniciar servidor de desenvolvimento (http://localhost:5173)
npm run dev
```

> Em desenvolvimento, a interface usa um mock server integrado — não é necessário ter o backend rodando para explorar a interface web.

---

### 3. Frontend Mobile

```bash
cd src/mobile
npm install
```

Em um terminal separado, inicie o mock server:

```bash
cd src/web/mock-server
node server.js
```

Em seguida, inicie o app:

```bash
npx expo start
```

Escaneie o QR Code com o aplicativo **Expo Go** no celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), ou pressione `a` para abrir no emulador Android e `i` para o simulador iOS.

# Código

O código-fonte do projeto está organizado em três módulos dentro da pasta [`src/`](src/):

| Módulo | Caminho | Descrição |
| --- | --- | --- |
| Backend (API REST) | [`src/backend/`](src/backend/) | Servidor Node.js · Express · TypeScript · Prisma · PostgreSQL |
| Frontend Web | [`src/web/`](src/web/) | Interface para médicos e recepcionistas · React · Vite · TypeScript |
| Frontend Mobile | [`src/mobile/`](src/mobile/) | Aplicativo para pacientes · React Native · Expo · TypeScript |

Para instruções de build, configuração e execução de cada módulo, consulte [`src/README.md`](src/README.md).

# Apresentação

O material de apresentação final do projeto está em [`presentation/`](presentation/), incluindo o resumo do processo de desenvolvimento, os slides e o vídeo demonstrativo da solução.

<li><a href="presentation/README.md"> Apresentação da solução</a></li>
