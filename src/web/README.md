# MedHub — Frontend Web

Interface web do sistema de agendamento de consultas MedHub, desenvolvida em React + Vite + TypeScript.

## Stack

| Tecnologia | Versão | Uso                  |
| ---------- | ------ | -------------------- |
| React      | 18.3   | Componentes e estado |
| Vite       | 6      | Build e dev server   |
| TypeScript | 5.6    | Tipagem estática     |

## Pré-requisitos

- Node.js 18+
- npm 9+

## Instalação

```bash
npm install
```

## Comandos

```bash
# Servidor de desenvolvimento (http://localhost:5173)
npm run dev

# Build de produção
npm run build

# Preview do build de produção
npm run preview

# Lint / formatação
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Estrutura

```
src/
├── lib/
│   ├── types.ts          # Tipos e interfaces TypeScript
│   ├── utils.ts          # Utilitários (formatação de data, status)
│   ├── api.ts            # Camada de serviço HTTP (fetch + mock server)
│   └── icons.tsx         # Biblioteca de ícones SVG
├── components/
│   ├── shell/            # Header, Sidebar, BottomNav
│   ├── states/           # LoadingState, EmptyState, ErrorState
│   ├── ui/               # PageHeader
│   └── widgets/          # HeroCTA, UpcomingAppointments, NotificationsPanel, etc.
├── views/                # Páginas da aplicação (ver tabela abaixo)
├── styles/
│   └── globals.css       # Design tokens e estilos base
└── main.tsx              # Entrada da aplicação
```

## Vistas implementadas

| Vista            | Condição               | Descrição                       |
| ---------------- | ---------------------- | ------------------------------- |
| Unauth           | `auth: 'unauth'`       | Landing page para visitantes    |
| Login            | `authView: 'login'`    | Formulário de autenticação      |
| Cadastro         | `authView: 'register'` | Formulário de criação de conta  |
| Home             | `view: 'home'`         | Dashboard do paciente           |
| Agendar          | `view: 'schedule'`     | Agendamento em 3 passos         |
| Minhas Consultas | `view: 'appointments'` | Gerenciar consultas agendadas   |
| Histórico        | `view: 'history'`      | Consultas realizadas            |
| Perfil           | `view: 'profile'`      | Dados e preferências do usuário |

## Design System

O sistema de design é baseado em tokens CSS (`globals.css`) com suporte a:

- **Temas:** claro e escuro (`data-theme`)
- **Cores de destaque:** teal, coral, índigo, floresta (`data-accent`)
- **Densidades:** compacto, confortável, espaçoso (`data-density`)

## Dados e API

A camada de comunicação com o servidor está em `src/lib/api.ts`. Em desenvolvimento, um mock server intercepta as chamadas `fetch` para `/api/*` e retorna dados simulados — sem necessidade de rodar o backend. Quando a integração real for ativada, basta apontar o Vite proxy para o backend e remover o mock server.

## Tipagem

Os tipos principais estão em `src/lib/types.ts` e espelham os modelos da API documentados em `docs/backend-apis.md`:

- `User`, `Appointment`, `Notification`
- `AppState` — estado global da aplicação (tema, vista ativa, auth)
