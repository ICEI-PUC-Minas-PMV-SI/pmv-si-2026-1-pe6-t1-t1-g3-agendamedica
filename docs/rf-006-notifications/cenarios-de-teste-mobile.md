# Cenários de Teste — Notificações Mobile (RF-006)

## Contexto

Este documento descreve os cenários de teste para o app mobile de notificações do MedHub, implementado no RF-006. Cada cenário cobre um comportamento isolado das telas e componentes de notificação, com passos numerados e resultado esperado para demonstração em vídeo ou print.

**Requisito funcional:** RF-006 — O sistema deve notificar os usuários sobre confirmações e cancelamentos de consultas.

**Plataforma:** Expo Go no simulador iOS

**Autenticação:** fazer login como paciente (Ana Paciente) antes de iniciar os cenários.

---

## Ferramentas utilizadas

| Ferramenta | O que é | Por que usamos |
| --- | --- | --- |
| **Expo Go** | App cliente para rodar o projeto no simulador iOS | Executa o app React Native sem necessidade de build nativo |
| **Mock Server** | Servidor Express local (`mock-server/server.js`) | Substitui o backend real em desenvolvimento — serve notificações e simula as operações de leitura sem depender do banco |
| **Expo DevTools / Metro** | Console do Metro Bundler | Confirmar que as chamadas de API foram disparadas ao interagir com notificações |
| **Proxyman / Charles** | Proxy HTTP local (opcional) | Inspecionar requisições de rede do simulador iOS para confirmar as chamadas PATCH |

---

## Pré-requisitos

1. Instalar dependências em `src/mobile/`: `npm install`
2. Iniciar o mock server: `node mock-server/server.js` (porta 3001)
3. Iniciar o app: `npx expo start` e abrir no simulador iOS via Expo Go
4. Fazer login como paciente (Ana Paciente)

**Estado inicial do mock server:** 20 notificações para o paciente autenticado, com mix de tipos (`APPOINTMENT_CREATED`, `APPOINTMENT_CONFIRMED`, `APPOINTMENT_CANCELLED`, `APPOINTMENT_RESCHEDULED`) e aproximadamente 50% lidas / 50% não lidas.

| ID | Tipo | Lida? |
| --- | --- | --- |
| `00000000-0000-0000-0000-000000000001` | APPOINTMENT_CREATED | não |
| `00000000-0000-0000-0000-000000000002` | APPOINTMENT_CONFIRMED | não |
| `00000000-0000-0000-0000-000000000003` | APPOINTMENT_CANCELLED | sim |
| `00000000-0000-0000-0000-000000000004` | APPOINTMENT_RESCHEDULED | não |
| *(16 notificações adicionais com mix de tipos e status)* | | |

---

## Seção 1 — Badge e Aba de Notificações

Cenários que cobrem o `DotBadge` exibido sobre o ícone de sino na aba "Alertas" da tab navigation.

---

### Cenário 1 — Badge exibe contagem de notificações não lidas na aba

**RF-006:** Contagem de notificações não lidas no ícone da aba

**Tela:** Tab navigation — `BellIcon` + `DotBadge` (`app/(tabs)/_layout.tsx`)

**Objetivo:** Demonstrar que o badge vermelho sobre o ícone de sino exibe a contagem correta de notificações não lidas ao abrir o app.

**Pré-condição:** Mock server com pelo menos 3 notificações com `read: false`.

**Passos:**
1. Iniciar o mock server: `node mock-server/server.js` (porta 3001)
2. Iniciar o app: `npx expo start` e abrir no simulador iOS
3. Fazer login como paciente (Ana Paciente)
4. Observar o badge vermelho sobre o ícone de sino na aba "Alertas"
5. Confirmar que o número exibido corresponde à quantidade de não lidas retornada por `GET /notifications/unread-count`

**Resultado esperado:**
- Badge vermelho (`danger`) visível com a contagem correta de não lidas
- Badge exibe "99+" quando a contagem ultrapassa 99
- Badge oculto quando a contagem é zero

**Mídia:** [▶ Cenário 1](assets/mobile/cenarios-de-teste/cenario-teste-1.mp4)

---

### Cenário 2 — Badge atualiza automaticamente a cada 30 segundos

**RF-006:** Atualização periódica da contagem de não lidas

**Tela:** Tab navigation — `NotificationCountProvider` (`lib/notification-count-context.tsx`)

**Objetivo:** Demonstrar que o `NotificationCountProvider` faz polling a cada 30 segundos e atualiza o badge sem interação do usuário.

**Pré-condição:** App aberto na aba home. Mock server retornando contagem inicial X.

**Passos:**
1. Com o app aberto e badge exibindo contagem X, alterar o mock server para incluir uma nova notificação não lida
2. Aguardar aproximadamente 30 segundos sem interação com o app
3. Observar o badge atualizar automaticamente para X+1

**Resultado esperado:**
- Badge atualiza sem necessidade de recarregar o app ou navegar entre telas
- Atualização ocorre em até 30 segundos após mudança no servidor
- Nenhuma interação do usuário necessária

**Mídia:** [▶ Cenário 2](assets/mobile/cenarios-de-teste/cenario-teste-2.mp4)

---

## Seção 2 — Tela de Notificações

Cenários que cobrem a listagem de notificações e seus diferentes estados visuais.

---

### Cenário 3 — Loading state exibido durante carregamento inicial

**RF-006:** Indicador de carregamento na tela de notificações

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que o indicador de carregamento aparece enquanto a lista de notificações é buscada da API.

**Pré-condição:** App no simulador iOS. Mock server rodando na porta 3001.

**Passos:**
1. Navegar para a aba "Alertas"
2. Observar o indicador de carregamento (`LoadingState`) aparecer brevemente durante a requisição
3. Aguardar o carregamento completar
4. Verificar que a lista de notificações é renderizada após a resposta

**Resultado esperado:**
- Estado de carregamento visível enquanto `GET /notifications` está em andamento
- Lista de notificações renderizada corretamente após a resposta da API

**Mídia:** [▶ Cenário 3](assets/mobile/cenarios-de-teste/cenario-teste-3.mp4)

---

### Cenário 4 — Estilo visual diferenciado para notificações não lidas

**RF-006:** Diferenciação visual entre notificações lidas e não lidas

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que notificações com `read: false` recebem fundo e tipografia diferenciados em relação às lidas.

**Pré-condição:** Mix de notificações lidas e não lidas presentes no mock server.

**Passos:**
1. Navegar para a aba "Alertas" e aguardar a lista carregar
2. Identificar uma notificação com `read: false` na lista
3. Identificar uma notificação com `read: true` na lista
4. Comparar o estilo visual das duas notificações

**Resultado esperado:**
- Notificações **não lidas**: fundo `accentSoft`, título em negrito (`bodyBold`), ponto azul (indicador) visível no canto superior direito do card
- Notificações **lidas**: fundo neutro, título em peso normal (`bodyMedium`), sem ponto indicador

**Mídia:** [▶ Cenário 4](assets/mobile/cenarios-de-teste/cenario-teste-4.mp4)

---

### Cenário 5 — Ícone emoji varia conforme tipo da notificação

**RF-006:** Identificação visual do tipo de notificação por emoji

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que cada tipo de notificação exibe o emoji correspondente na lista.

**Pré-condição:** Mock server com pelo menos uma notificação de cada um dos quatro tipos.

**Passos:**
1. Navegar para a aba "Alertas"
2. Identificar na lista uma notificação do tipo `APPOINTMENT_CREATED`
3. Identificar uma notificação do tipo `APPOINTMENT_CONFIRMED`
4. Identificar uma notificação do tipo `APPOINTMENT_CANCELLED`
5. Identificar uma notificação do tipo `APPOINTMENT_RESCHEDULED`
6. Verificar o emoji exibido em cada caso

**Resultado esperado:**
- `APPOINTMENT_CREATED` → 📅
- `APPOINTMENT_CONFIRMED` → ✅
- `APPOINTMENT_CANCELLED` → ❌
- `APPOINTMENT_RESCHEDULED` → 🔄

**Mídia:** [▶ Cenário 5](assets/mobile/cenarios-de-teste/cenario-teste-5.mp4)

---

### Cenário 6 — Pull-to-refresh atualiza a lista

**RF-006:** Atualização manual da lista de notificações

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que arrastar a lista para baixo (pull-to-refresh) recarrega as notificações do servidor.

**Pré-condição:** App na tela de notificações com a lista já carregada. Mock server rodando.

**Passos:**
1. Navegar para a aba "Alertas" e aguardar a lista carregar
2. Alterar os dados no mock server externamente (ex: adicionar uma nova notificação)
3. Na tela do simulador, puxar a lista de notificações para baixo e soltar
4. Observar o `RefreshControl` aparecer durante o recarregamento
5. Verificar que a lista atualiza com os dados mais recentes do servidor

**Resultado esperado:**
- `RefreshControl` (spinner nativo do iOS) visível enquanto recarrega
- Lista atualizada refletindo os dados atuais do mock server após o refresh

**Mídia:** [▶ Cenário 6](assets/mobile/cenarios-de-teste/cenario-teste-6.mp4)

---

### Cenário 7 — Estado vazio quando não há notificações

**RF-006:** Mensagem de estado vazio na ausência de notificações

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar o `EmptyState` exibido quando o usuário não possui nenhuma notificação.

**Pré-condição:** Mock server configurado para retornar `data: []` para o usuário autenticado.

**Passos:**
1. Configurar o mock server para retornar lista vazia: `{ "data": [], "pagination": { "total": 0 } }`
2. Navegar para a aba "Alertas"
3. Aguardar o carregamento completar
4. Observar a tela de estado vazio

**Resultado esperado:**
- Componente `EmptyState` visível com mensagem informativa (ex: "Você não tem notificações")
- Nenhum item de lista renderizado
- Badge na aba "Alertas" oculto ou zerado

**Mídia:** [▶ Cenário 7](assets/mobile/cenarios-de-teste/cenario-teste-7.mp4)

---

## Seção 3 — Interações com Notificações

Cenários que cobrem as ações disponíveis em notificações individuais e em lote.

---

### Cenário 8 — Marcar notificação como lida ao tocar

**RF-006:** Marcação individual de notificação como lida

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que tocar em uma notificação não lida a marca como lida com atualização visual imediata e disparo da chamada à API.

**Pré-condição:** Pelo menos uma notificação com `read: false` presente na lista.

**Passos:**
1. Navegar para a aba "Alertas"
2. Identificar uma notificação com estilo de não lida (fundo `accentSoft`, ponto azul)
3. Tocar na notificação
4. Observar a mudança visual imediata: fundo retorna ao neutro e ponto azul desaparece
5. Verificar no console do Metro/Expo a chamada `PATCH /notifications/:id/read`
6. Confirmar que o badge na aba "Alertas" decrementa em 1

**Resultado esperado:**
- Estilo da notificação muda imediatamente para "lida" (sem recarregar a lista)
- Badge da aba decrementado em 1
- Chamada `PATCH /notifications/:id/read` enviada ao mock server com o ID correto

**Mídia:** [▶ Cenário 8](assets/mobile/cenarios-de-teste/cenario-teste-8.mp4)

---

### Cenário 9 — Marcar notificação como não lida ao tocar novamente

**RF-006:** Reversão de notificação para não lida

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que tocar em uma notificação já lida exibe a opção de revertê-la para não lida e que a ação restaura o estilo visual.

**Pré-condição:** Pelo menos uma notificação com `read: true` presente na lista.

**Passos:**
1. Navegar para a aba "Alertas"
2. Identificar uma notificação com estilo de lida (fundo neutro, sem ponto azul)
3. Tocar na notificação lida
4. Observar o menu de contexto ou ação exibida
5. Selecionar a opção de marcar como não lida
6. Observar o fundo mudar para `accentSoft` e o ponto azul reaparecer
7. Confirmar que o badge na aba "Alertas" incrementa em 1

**Resultado esperado:**
- Opção de "marcar como não lida" acessível ao tocar em notificação lida
- Estilo visual restaurado para "não lida" imediatamente
- Badge incrementado em 1
- Chamada `PATCH /notifications/:id/unread` enviada ao mock server

**Mídia:** [▶ Cenário 9](assets/mobile/cenarios-de-teste/cenario-teste-9.mp4)

---

### Cenário 10 — Botão "Marcar todas como lidas" aparece apenas quando há não lidas

**RF-006:** Visibilidade condicional do botão de marcação em lote

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que o botão de marcação em lote só é renderizado enquanto existirem notificações não lidas.

**Pré-condição:** Mock server com mix de notificações lidas e não lidas.

**Passos:**
1. Navegar para a aba "Alertas" com notificações não lidas presentes
2. Verificar que o botão "Marcar todas como lidas" está visível no topo da lista
3. Realizar o pull-to-refresh após configurar o mock server para retornar apenas notificações lidas
4. Observar que o botão desaparece da interface

**Resultado esperado:**
- Botão visível no topo da lista quando há pelo menos uma notificação não lida
- Botão ausente quando todas as notificações estão lidas

**Mídia:** [▶ Cenário 10](assets/mobile/cenarios-de-teste/cenario-teste-10.mp4)

---

### Cenário 11 — Marcar todas as notificações como lidas

**RF-006:** Marcação em lote de todas as notificações como lidas

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que o botão "Marcar todas como lidas" atualiza o estilo de todas as notificações e zera o badge de uma só vez.

**Pré-condição:** Pelo menos duas notificações com `read: false` presentes na lista.

**Passos:**
1. Navegar para a aba "Alertas"
2. Observar o badge na aba com a contagem de não lidas
3. Tocar no botão "Marcar todas como lidas" no topo da lista
4. Observar todas as notificações da lista mudarem visualmente para o estilo "lida"
5. Confirmar que o badge da aba "Alertas" zera imediatamente
6. Verificar no console do Metro/Expo a chamada `PATCH /notifications/read-all`
7. Verificar que o botão "Marcar todas como lidas" desaparece

**Resultado esperado:**
- Todas as notificações passam para o estilo de "lida" sem recarregar a lista
- Badge da aba zerado imediatamente após o toque
- Chamada `PATCH /notifications/read-all` disparada
- Botão "Marcar todas como lidas" removido da interface

**Mídia:** [▶ Cenário 11](assets/mobile/cenarios-de-teste/cenario-teste-11.mp4)

---

## Seção 4 — Push Notifications

Cenários que cobrem o fluxo de registro de permissões e recebimento de notificações push via `expo-notifications`.

> **Nota sobre o simulador iOS:** O simulador não suporta Expo Push Tokens reais para envio remoto. O CT-012 verifica o fluxo de registro do token (chamada à API), e o CT-013 usa `scheduleNotificationAsync` para simular um push localmente sem depender de envio remoto.

---

### Cenário 12 — Registro do push token no login

**RF-006:** Registro do dispositivo para recebimento de push notifications

**Tela:** `lib/auth-context.tsx` — `registerForPushNotifications()`

**Objetivo:** Demonstrar que ao fazer login, o app solicita permissão de notificações push e registra o token no backend via `PATCH /users/me/push-token`.

**Pré-condição:** Simulador iOS com permissões de notificação não concedidas anteriormente. Mock server com endpoint `PATCH /users/me/push-token` configurado.

**Passos:**
1. Deslogar do app (ou usar o simulador com estado limpo)
2. Iniciar o processo de login como paciente (Ana Paciente)
3. Após o login bem-sucedido, observar o diálogo de permissão de notificações do iOS
4. Conceder a permissão no diálogo
5. Verificar no console do Metro que `registerForPushNotifications()` foi chamada
6. Verificar nos logs do mock server que `PATCH /users/me/push-token` foi recebido com o campo `expoPushToken`

**Resultado esperado:**
- Diálogo de permissão de notificações iOS aparece após o login
- Chamada `PATCH /users/me/push-token` registrada no mock server com o token gerado pelo Expo
- Falha no registro não impede o acesso ao app (fluxo non-blocking)

**Mídia:** [▶ Cenário 12](assets/mobile/cenarios-de-teste/cenario-teste-12.mp4)

---

### Cenário 13 — Recebimento de notificação push em foreground via Expo

**RF-006:** Exibição de notificação push com o app em primeiro plano

**Tela:** App em foreground — `expo-notifications`

**Objetivo:** Demonstrar que o app exibe um banner de notificação ao receber um push enquanto está aberto em foreground.

**Pré-condição:** App rodando em foreground no simulador iOS. Terminal disponível para executar o comando de disparo.

**Passos:**
1. Com o app aberto e visível no simulador iOS, abrir o terminal
2. Executar o seguinte comando para agendar uma notificação local simulando um push recebido:
   ```bash
   # Via Expo CLI (requer o app em modo desenvolvimento)
   npx expo push:send --to "<expo-push-token>" \
     --title "Consulta confirmada" \
     --body "Sua consulta com Dr. Carlos foi confirmada."
   ```
   Ou, alternativamente, via código no console do Expo DevTools:
   ```js
   await Notifications.scheduleNotificationAsync({
     content: { title: "Consulta confirmada", body: "Sua consulta com Dr. Carlos foi confirmada." },
     trigger: null
   });
   ```
3. Observar o banner de notificação aparecer sobre o app no simulador
4. Tocar no banner de notificação

**Resultado esperado:**
- Banner de notificação visível no topo da tela enquanto o app está em foreground
- Notificação exibe o título e o corpo corretamente
- Ao tocar no banner, o app permanece aberto (comportamento padrão em foreground)

**Mídia:** [▶ Cenário 13](assets/mobile/cenarios-de-teste/cenario-teste-13.mp4)
