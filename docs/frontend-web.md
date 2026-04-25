# Front-end Web

Interface web do **MedHub**, sistema de agendamento de consultas médicas. Permite que pacientes visualizem, agendem e gerenciem consultas, além de acompanhar notificações e histórico de atendimentos, tudo em uma interface responsiva, acessível em desktop e dispositivos móveis.

---

## Projeto da Interface Web

A interface foi construída como uma Single Page Application (SPA) sem roteamento por URL. A navegação entre telas é controlada por um estado interno (`AppState`) em `App.tsx`, e cada view é renderizada de forma condicional. Isso simplifica o deploy (apenas arquivos estáticos) e evita dependências de um servidor de rotas.

### Wireframes

A interface é organizada em um shell fixo de três regiões, adaptado conforme o dispositivo:

**Desktop (> 1000px)**
```
┌─────────────────────────────────────────┐
│              Header (64px)              │
├───────────┬─────────────────────────────┤
│           │                             │
│  Sidebar  │       Conteúdo da view      │
│  (244px)  │                             │
│           │                             │
└───────────┴─────────────────────────────┘
```

**Mobile (≤ 1000px)**
```
┌─────────────────────┐
│       Header        │
├─────────────────────┤
│                     │
│  Conteúdo da view   │
│                     │
├─────────────────────┤
│  Bottom Navigation  │
└─────────────────────┘
```

**Fluxo de autenticação**
```
Landing (UnauthView)
   ├── "Entrar"              → LoginView  → Dashboard (HomeView)
   └── "Criar conta"         → RegisterView → Dashboard (HomeView)
```

**Views autenticadas (paciente)**
```
HomeView          — dashboard com próximas consultas e notificações
ScheduleView      — agendamento em 3 passos (especialidade → médico → horário)
AppointmentsView  — consultas agendadas com status e ações
HistoryView       — histórico de consultas realizadas
ProfileView       — dados pessoais, aparência e preferências de aviso
```

### Design Visual

**Tipografia**

| Função    | Família        | Uso                                      |
| --------- | -------------- | ---------------------------------------- |
| Interface | Inter Tight    | Textos, labels, botões                   |
| Display   | Fraunces       | Títulos de página e headings de destaque |
| Monospace | JetBrains Mono | Dados técnicos, chips de código          |

**Paleta de cores**

O sistema usa tokens OKLCH para garantir perceptibilidade uniforme entre tons. Há suporte a tema claro e escuro (via atributo `data-theme` no elemento `<html>`):

| Token                 | Tema claro          | Uso                                |
| --------------------- | ------------------- | ---------------------------------- |
| `--bg`                | Branco frio         | Fundo da página                    |
| `--surface`           | Branco puro         | Cards e painéis                    |
| `--ink`               | Grafite escuro      | Texto principal                    |
| `--ink-2` / `--ink-3` | Tons intermediários | Texto secundário e terciário       |
| `--accent`            | Teal (padrão)       | Botões primários, links, destaques |

**Cores de destaque (accent)** — configuráveis via `data-accent`:

| Nome     | Tom                      |
| -------- | ------------------------ |
| `teal`   | Azul-esverdeado (padrão) |
| `coral`  | Laranja-avermelhado      |
| `indigo` | Roxo-índigo              |
| `forest` | Verde-floresta           |

**Ícones**

Todos os ícones são SVG inline, definidos em `src/lib/icons.tsx`. Não há dependência de biblioteca de ícones externa.

---

## Fluxo de Dados

```
Usuário interage com a view
       │
       ▼
App.tsx (AppState + callbacks)
       │
       ▼
src/lib/api.ts  ──fetch──►  Vite proxy /api  ──►  mock-server :3001
                                                         │
                                             mock-server/data/*.json
       │
       ◄── resposta JSON ──────────────────────────────────
       │
       ▼
useState (appointments, notifications, currentUser)
       │
       ▼
Props → Views / Widgets
```

**Pontos-chave:**
- Todo o estado global está em `App.tsx` — sem Context API, Redux ou Zustand
- As views recebem dados e callbacks via props (prop drilling direto)
- `api.ts` centraliza todas as chamadas HTTP; nenhum componente faz `fetch` diretamente
- O mock server espelha as rotas reais do backend (`/auth`, `/appointments`, `/notifications`), tornando a substituição futura transparente

---

## Tecnologias Utilizadas

| Tecnologia            | Versão | Função                                          |
| --------------------- | ------ | ----------------------------------------------- |
| React                 | 18.3   | Componentização e gerenciamento de estado local |
| TypeScript            | 5.6    | Tipagem estática em todo o projeto              |
| Vite                  | 6      | Build tool, dev server com HMR e proxy HTTP     |
| Express               | 4.x    | Mock server local (espelha rotas do backend)    |
| CSS Custom Properties | —      | Design tokens, temas e densidades               |
| ESLint + Prettier     | —      | Padronização e formatação de código             |

---

## Considerações de Segurança

- **Autenticação via JWT:** o fluxo de login e cadastro já está estruturado para receber e armazenar um token JWT retornado pelo backend. O token é mantido em memória (`api.ts`), sem persistência em `localStorage` para evitar vulnerabilidades XSS.
- **Headers de autorização:** todas as chamadas autenticadas incluem `Authorization: Bearer <token>` via a função `authHeaders()` em `api.ts`.
- **Validação de formulários:** os campos de login, cadastro e agendamento usam validação nativa HTML (`required`, `type="email"`, etc.). Validação adicional será aplicada na integração com o backend.
- **Sem exposição de dados sensíveis:** o mock server não armazena senhas nem valida credenciais — é apenas para desenvolvimento. Em produção, toda autenticação passa pelo backend com bcrypt e JWT assinado.
- **Proteção de rotas:** quando `auth === 'unauth'`, nenhuma view autenticada é renderizada — o controle de acesso está no nível do estado da aplicação.

---

## Implantação

A interface web é composta apenas por arquivos estáticos após o build, e pode ser hospedada em qualquer CDN ou servidor de arquivos estáticos.

**Pré-requisitos:**
- Node.js 18+ e npm 9+
- Backend MedHub (`src/backend`) em execução

**Build de produção:**

```bash
cd src/web
npm install
npm run build
# Arquivos gerados em src/web/dist/
```

**Configuração do proxy:**

Em produção, o servidor web (Nginx, Caddy, etc.) deve redirecionar requisições `/api/*` para o backend. Exemplo Nginx:

```nginx
location /api/ {
    proxy_pass http://backend:3001/;
}
```

Durante o desenvolvimento, isso é feito automaticamente pelo Vite (`vite.config.ts`).

**Variáveis de ambiente:**

Não há variáveis de ambiente necessárias no frontend — a URL base da API é controlada pelo proxy do servidor web.

---

## Testes

**Checklist de testes manuais realizados:**

- [ ] Fluxo de login: credenciais válidas redirecionam para o dashboard
- [ ] Fluxo de cadastro: nome digitado aparece no header e no perfil
- [ ] Logout: retorna para a landing e limpa o estado do usuário
- [ ] Dashboard: próximas consultas e notificações carregam corretamente
- [ ] Histórico: consultas com diferentes status exibem chips corretos (confirmada, cancelada, etc.)
- [ ] Tema escuro: alternância em Perfil → Aparência reflete em toda a interface
- [ ] Responsividade: sidebar some em mobile, bottom nav aparece corretamente
- [ ] Estado vazio: `appointments.json` vazio exibe mensagem de estado **vazio**

---

# Referências

- [React 18 — Documentação oficial](https://react.dev)
- [Vite — Documentação oficial](https://vitejs.dev)
- [Inter Tight — Google Fonts](https://fonts.google.com/specimen/Inter+Tight)
- [Fraunces — Google Fonts](https://fonts.google.com/specimen/Fraunces)
- [OKLCH Color Space — CSS Color 4](https://www.w3.org/TR/css-color-4/#oklch-colors)
- `docs/backend-apis.md` — especificação das rotas da API do backend MedHub
- `docs/contexto.md` — requisitos e contexto do projeto (ETAPA 1)
