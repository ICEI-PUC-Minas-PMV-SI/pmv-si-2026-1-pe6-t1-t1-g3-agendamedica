# MedHub — Frontend Web

Interface web do sistema de agendamento de consultas MedHub, desenvolvida em React + Vite + TypeScript.

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18.3 | Componentes e estado |
| Vite | 6 | Build e dev server |
| TypeScript | 5.6 | Tipagem estática |

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
```

## Estrutura

```
src/
├── lib/
│   ├── types.ts          # Tipos e interfaces TypeScript
│   ├── utils.ts          # Utilitários (formatação de data, status)
│   ├── mockData.tsx      # Dados mock (substitutos da API)
│   └── icons.tsx         # Biblioteca de ícones SVG
├── components/
│   ├── shell/            # Header, Sidebar, BottomNav
│   ├── states/           # LoadingState, EmptyState, ErrorState
│   ├── ui/               # PageHeader
│   └── widgets/          # HeroCTA, UpcomingAppointments, NotificationsPanel, etc.
├── views/                # Páginas: Home, Agendar, Consultas, Histórico, Perfil, Unauth
├── tweaks/               # Painel de tweaks para demonstração do design system
├── styles/
│   └── globals.css       # Design tokens e estilos base
└── main.tsx              # Entrada da aplicação
```

## Vistas implementadas

| Vista | Rota (estado) | Descrição |
|---|---|---|
| Unauth | `auth: 'unauth'` | Landing page para visitantes |
| Home | `view: 'home'` | Dashboard do paciente |
| Agendar | `view: 'schedule'` | Agendamento em 3 passos |
| Minhas Consultas | `view: 'appointments'` | Gerenciar consultas agendadas |
| Histórico | `view: 'history'` | Consultas realizadas |
| Perfil | `view: 'profile'` | Dados e preferências do usuário |

## Design System

O sistema de design é baseado em tokens CSS (`globals.css`) com suporte a:

- **Temas:** claro e escuro (`data-theme`)
- **Cores de destaque:** teal, coral, índigo, floresta (`data-accent`)
- **Densidades:** compacto, confortável, espaçoso (`data-density`)

### Painel de Tweaks

Clique no ícone ✦ no canto superior direito do header para abrir o painel de tweaks. Ele permite alternar tema, cor, densidade, estado de carregamento e vista — útil para demonstrar o design system.

## Dados

Atualmente a aplicação utiliza dados mock definidos em `src/lib/mockData.tsx`. A integração com a API REST do backend (`src/backend`) será feita em uma etapa futura.

## Tipagem

Os tipos principais estão em `src/lib/types.ts` e espelham os modelos da API documentados em `docs/backend-apis.md`:

- `User`, `Appointment`, `Notification`, `Activity`
- `AppState` — estado global da aplicação (tema, vista ativa, auth)
