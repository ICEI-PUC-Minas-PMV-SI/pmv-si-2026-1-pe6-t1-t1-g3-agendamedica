# Cenários de Teste — Notificações Frontend (RF-006)

## Contexto

Este documento descreve os cenários de teste para a interface web de notificações do MedHub, implementada no RF-006. Cada cenário cobre um comportamento visual isolado dos componentes de notificação, com passos numerados e resultado esperado para demonstração em vídeo ou print.

**Requisito funcional:** RF-006 — O sistema deve notificar os usuários sobre confirmações e cancelamentos de consultas.

**URL local:** `http://localhost:5173`

**Autenticação:** fazer login como paciente antes de iniciar os cenários.

---

## Ferramentas utilizadas

| Ferramenta             | O que é                                          | Por que usamos                                                                                                          |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Navegador**          | Chrome ou Firefox                                | Executar a aplicação e capturar os cenários                                                                             |
| **Mock Server**        | Servidor Express local (`mock-server/server.js`) | Substitui o backend real em desenvolvimento — serve notificações e simula as operações de leitura sem depender do banco |
| **DevTools (Network)** | Aba Network do navegador                         | Confirmar que as chamadas PATCH foram disparadas ao marcar como lida                                                    |

---

## Pré-requisitos

1. Instalar dependências em `src/web/`: `npm install`
2. Iniciar o mock server: `node mock-server/server.js` (porta 3001)
3. Iniciar o frontend: `npm run dev` (porta 5173)
4. Acessar `http://localhost:5173` e fazer login como paciente

**Estado inicial do mock server:** 100 notificações para o paciente autenticado, com mix de tipos (`APPOINTMENT_CONFIRMED`, `APPOINTMENT_RESCHEDULED`, `APPOINTMENT_CREATED`, `REMINDER`, `APPOINTMENT_CANCELLED`) e aproximadamente 50% lidas / 50% não lidas.

---

## Seção 1 — Dropdown de Notificações (Header)

Cenários que cobrem o componente `NotificationDropdown`, acessível pelo ícone de sino no header.

---

### Cenário 1 — Badge de não lidas e marcação em lote como lidas

**RF-006:** Contagem de notificações não lidas e marcação em lote

**Componente:** `NotificationDropdown`

**Objetivo:** Demonstrar que o badge exibe a contagem de não lidas e que o botão "Marcar todas lidas" zera o badge de forma imediata.

**Pré-condição:** Pelo menos duas notificações com `read: false` presentes.

**Passos:**
1. Acessar `http://localhost:5173` e fazer login
2. Observar o badge sobre o ícone de sino com a contagem de não lidas
3. Clicar no ícone de sino para abrir o dropdown
4. Clicar no botão "Marcar todas lidas"
5. Observar o badge desaparecer
6. Confirmar a chamada `PATCH /notifications/read-all` na aba Network

**Resultado esperado:**
- Badge visível com a contagem correta ao carregar
- Todas as notificações ficam visualmente marcadas como lidas
- O badge desaparece (contagem zero)
- A chamada `PATCH /notifications/read-all` é disparada

**Mídia:** `[▶ Cenário 1 — vídeo/print]`

---

### Cenário 2 — Marcar uma notificação como lida pelo dropdown

**RF-006:** Marcação individual de notificação como lida

**Componente:** `NotificationDropdown`

**Objetivo:** Demonstrar que clicar em uma notificação não lida a marca como lida de forma imediata (update otimista) e dispara a chamada à API.

**Pré-condição:** Pelo menos uma notificação com `read: false` presente.

**Passos:**
1. Clicar no ícone de sino para abrir o dropdown
2. Observar o badge exibindo a contagem de não lidas
3. Clicar em uma notificação com status não lido
4. Observar a mudança visual imediata na notificação
5. Verificar na aba Network a chamada `PATCH /notifications/:id/read`

**Resultado esperado:**
- A notificação clicada muda visualmente para o estado lido sem recarregar a página
- O badge é decrementado em 1 imediatamente
- A chamada `PATCH /notifications/:id/read` é disparada com o ID correto

**Mídia:** `[▶ Cenário 2 — vídeo/print]`

---

### Cenário 3 — Navegar para a página de notificações pelo dropdown

**RF-006:** Acesso à listagem completa de notificações

**Componente:** `NotificationDropdown` → `NotificationsView`

**Objetivo:** Demonstrar que o botão "Ver todas as notificações →" no dropdown navega corretamente para a página de notificações.

**Pré-condição:** Usuário autenticado com notificações carregadas.

**Passos:**
1. Clicar no ícone de sino para abrir o dropdown
2. Clicar no botão "Ver todas as notificações →" no rodapé do dropdown
3. Observar a navegação para a página de notificações

**Resultado esperado:**
- O dropdown fecha
- A aplicação navega para a página "Notificações" com todas as notificações listadas
- A URL não muda (roteamento por estado interno)

**Mídia:** `[▶ Cenário 3 — vídeo/print]`

---

### Cenário 4 — Bottom sheet móvel: abertura e fechamento com animação

**RF-006:** Exibição adaptativa de notificações em dispositivos móveis

**Componente:** `NotificationDropdown` (modo mobile — bottom sheet)

**Objetivo:** Demonstrar que em viewports móveis (≤640px) o dropdown é substituído por um bottom sheet que desliza de baixo para cima ao abrir e de volta ao fechar.

**Pré-condição:** Usuário autenticado. DevTools com viewport de dispositivo móvel ativo (ex: iPhone 12, 390px).

**Passos:**
1. Abrir o DevTools e ativar o modo dispositivo com viewport ≤640px
2. Clicar no ícone de sino no header
3. Observar o bottom sheet deslizar de baixo para cima com backdrop semitransparente
4. Tocar no backdrop (área escura fora do painel)
5. Observar o bottom sheet deslizar de volta para baixo

**Resultado esperado:**
- Em viewport móvel, abre bottom sheet (não dropdown)
- Animação suave de entrada (`translateY(100%) → translateY(0)`) em 320ms
- Toque no backdrop fecha o sheet com animação de saída inversa
- Drag handle decorativo visível no topo do sheet

**Mídia:** `[▶ Cenário 4 — vídeo/print]`

---

### Cenário 5 — Navegar para a página de notificações pelo bottom sheet

**RF-006:** Acesso à listagem completa via interface móvel

**Componente:** `NotificationDropdown` (bottom sheet) → `NotificationsView`

**Objetivo:** Demonstrar que o botão "Ver todas as notificações →" no rodapé do bottom sheet navega corretamente para a página de notificações.

**Pré-condição:** Viewport móvel ativo (≤640px). Usuário autenticado com notificações carregadas.

**Passos:**
1. Com DevTools em modo móvel (≤640px), clicar no sino para abrir o bottom sheet
2. Rolar a lista de notificações até o rodapé
3. Clicar em "Ver todas as notificações →"
4. Observar o sheet fechar com animação de saída
5. Verificar a navegação para a página de notificações

**Resultado esperado:**
- Bottom sheet fecha com animação de saída (slide down)
- Aplicação navega para a página "Notificações" com todas as notificações listadas
- URL não muda (roteamento por estado interno)

**Mídia:** `[▶ Cenário 5 — vídeo/print]`

---

### Cenário 6 — Dropdown desktop limitado em altura com scroll interno

**RF-006:** Exibição de notificações sem ultrapassar os limites da tela

**Componente:** `NotificationDropdown` (modo desktop — dropdown)

**Objetivo:** Demonstrar que com muitas notificações o dropdown desktop é limitado em altura e exibe scroll interno, sem ultrapassar os limites da viewport.

**Pré-condição:** Viewport desktop (>640px). Mock server com 100 notificações carregadas.

**Passos:**
1. Garantir viewport acima de 640px (modo desktop)
2. Clicar no ícone de sino para abrir o dropdown
3. Observar que o dropdown não ultrapassa o final da tela
4. Rolar a lista de notificações dentro do dropdown
5. Clicar fora do dropdown para fechá-lo

**Resultado esperado:**
- Dropdown limitado a no máximo 480px de altura (ou menos em telas curtas)
- Lista de notificações com scroll interno
- Header ("Notificações" + "Marcar todas lidas") e rodapé ("Ver todas →") sempre visíveis
- Dropdown não ultrapassa os limites da viewport

**Mídia:** `[▶ Cenário 6 — vídeo/print]`

---

## Seção 2 — Painel de Notificações (Home)

Cenários que cobrem o componente `NotificationsPanel`, exibido na tela inicial do paciente.

---

### Cenário 7 — Marcar e desmarcar notificações como lidas pelo painel

**RF-006:** Listagem com filtro de lidas/não lidas e atualização de estado

**Componente:** `NotificationsPanel`

**Objetivo:** Demonstrar o filtro por "Não lidas", a marcação individual de uma notificação como lida e a reversão para não lida, com atualização visual imediata e chamada à API.

**Pré-condição:** Mix de notificações lidas e não lidas no mock server.

**Passos:**
1. Acessar a home após login
2. Localizar o painel de notificações com a aba "Não lidas" ativa por padrão
3. Clicar em uma notificação não lida — observar ela desaparecer da aba "Não lidas"
4. Confirmar na aba Network a chamada `PATCH /notifications/:id/read`
5. Selecionar a aba "Todas" e localizar a notificação agora marcada como lida
6. Clicar em "Marcar não lida" na notificação
7. Confirmar na aba Network a chamada `PATCH /notifications/:id/unread`
8. Alternar de volta para a aba "Não lidas" e verificar que a notificação voltou a aparecer

**Resultado esperado:**
- Aba "Não lidas" exibe somente notificações com `read: false`
- Clicar em uma notificação não lida a remove da aba imediatamente (update otimista) e dispara `PATCH /notifications/:id/read`
- "Marcar não lida" reverte o estado visualmente e dispara `PATCH /notifications/:id/unread`
- O badge no header é atualizado em ambas as direções

**Mídia:** `[▶ Cenário 7 — vídeo/print]`

---

## Seção 3 — Página de Notificações (NotificationsView)

Cenários que cobrem a página completa de notificações, acessível pelo dropdown ou pelo painel da home.

---

### Cenário 8 — Marcar e desmarcar notificações como lidas na página completa

**RF-006:** Listagem completa de notificações com atualização de estado

**Componente:** `NotificationsView`

**Objetivo:** Demonstrar que a página exibe todas as notificações sem paginação e que é possível marcar como lida e reverter para não lida, com atualização visual imediata e chamada à API.

**Pré-condição:** Mock server com 100 notificações carregadas, mix de lidas e não lidas.

**Passos:**
1. Navegar para a página de notificações (pelo dropdown ou pelo painel)
2. Observar que todas as notificações são listadas sem paginação
3. Clicar em "Marcar como lida" em uma notificação não lida
4. Confirmar na aba Network a chamada `PATCH /notifications/:id/read`
5. Observar a mudança visual imediata (indicador e destaque removidos)
6. Clicar em "Marcar como não lida" na mesma notificação
7. Confirmar na aba Network a chamada `PATCH /notifications/:id/unread`
8. Verificar que o destaque visual e o badge no header são restaurados

**Resultado esperado:**
- Todas as notificações listadas sem limite de itens
- "Marcar como lida" remove o destaque visual imediatamente e dispara `PATCH /notifications/:id/read`
- "Marcar como não lida" restaura o destaque e dispara `PATCH /notifications/:id/unread`
- O badge no header é atualizado em ambas as direções

**Mídia:** `[▶ Cenário 8 — vídeo/print]`

