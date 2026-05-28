# Cenários de Teste — Notificações Mobile (RF-006)

## Contexto

Este documento descreve os cenários de teste para o app mobile de notificações do MedHub, implementado no RF-006. Cada cenário cobre um comportamento isolado das telas e componentes de notificação, com passos numerados e resultado esperado para demonstração em vídeo ou print.

**Requisito funcional:** RF-006 — O sistema deve notificar os usuários sobre confirmações e cancelamentos de consultas.

**Plataforma:** Simulador iOS — Expo Go (Seções 1–3) e Development Build com `expo-dev-client` (Seção 4 — Push Notifications)

**Autenticação:** app autenticado como paciente (Ana Paciente) — pré-condição assumida em todos os cenários.

---

## Ferramentas utilizadas

| Ferramenta | O que é | Por que usamos |
| --- | --- | --- |
| **Expo Go** | App cliente para rodar o projeto no simulador iOS | Executa o app React Native sem necessidade de build nativo — usado nas Seções 1–3 |
| **Development Build** | Build nativo do MedHub gerado via `npx expo run:ios` | Instala o app como `MedHub.app` no simulador, habilitando push notifications via APNs local — necessário para a Seção 4 |
| **Mock Server** | Servidor Express local (`src/web/mock-server/server.js`) | Substitui o backend real em desenvolvimento — serve notificações e simula as operações de leitura sem depender do banco |
| **Expo DevTools / Metro** | Console do Metro Bundler | Confirmar que as chamadas de API foram disparadas ao interagir com notificações |
| **xcrun simctl** | Ferramenta de linha de comando do Xcode | Enviar payloads APNs diretamente ao simulador iOS sem depender da infraestrutura APNs real |
| **Proxyman / Charles** | Proxy HTTP local (opcional) | Inspecionar requisições de rede do simulador iOS para confirmar as chamadas PATCH |

---

## Pré-requisitos

1. Instalar dependências em `src/mobile/`: `npm install`
2. Iniciar o mock server: `node src/web/mock-server/server.js` (porta 3000)
3. **Seções 1–3:** Iniciar o app com `npx expo start` e abrir no simulador iOS via Expo Go
4. **Seção 4:** Instalar `expo-dev-client` (`npx expo install expo-dev-client`) e buildar com `npx expo run:ios`

**Estado inicial do mock server:** 100 notificações para o paciente autenticado, com mix de tipos (`APPOINTMENT_CREATED`, `APPOINTMENT_CONFIRMED`, `APPOINTMENT_CANCELLED`, `APPOINTMENT_RESCHEDULED`) e 51 lidas / 49 não lidas.

| ID | Tipo | Lida? |
| --- | --- | --- |
| `n-001` | APPOINTMENT_CONFIRMED | não |
| `n-002` | APPOINTMENT_RESCHEDULED | não |
| `n-003` | APPOINTMENT_CREATED | não |
| `n-004` | APPOINTMENT_CREATED | sim |
| *(96 notificações adicionais com mix de tipos e status)* | | |

---

## Seção 1 — Badge e Aba de Notificações

---

### Cenário 1 — Badge: contagem e atualização automática

**RF-006:** Contagem e atualização periódica de notificações não lidas no ícone da aba

**Tela:** Tab navigation — `BellIcon` + `DotBadge` (`app/(tabs)/_layout.tsx`) · `NotificationCountProvider` (`lib/notification-count-context.tsx`)

**Objetivo:** Demonstrar que o badge vermelho sobre o ícone de sino exibe a contagem correta de não lidas e atualiza automaticamente a cada 30 segundos sem interação do usuário.

**Pré-condição:** Mock server rodando. App aberto na aba home com badge exibindo a contagem inicial de não lidas.

**Passos:**
1. Iniciar o mock server: `node src/web/mock-server/server.js` (porta 3000)
2. Iniciar o app: `npx expo start` e abrir no simulador iOS
3. Observar o badge vermelho sobre o ícone de sino na aba "Alertas"
4. Confirmar que o número exibido corresponde à quantidade de não lidas retornada por `GET /notifications/unread-count`
5. Editar `src/web/mock-server/data/notifications.json` para incluir uma nova notificação com `read: false` e reiniciar o servidor
6. Aguardar aproximadamente 30 segundos sem interação com o app
7. Observar o badge atualizar automaticamente para refletir a nova contagem

**Resultado esperado:**
- Badge vermelho (`danger`) visível com a contagem correta de não lidas
- Badge atualiza sem necessidade de recarregar o app ou navegar entre telas
- Atualização ocorre em até 30 segundos após mudança no servidor

**Mídia:** [▶ Cenário 1](assets/mobile/cenarios-de-teste/cenario-teste-1.mp4)

---

## Seção 2 — Tela de Notificações

---

### Cenário 2 — Tela de alertas: carregamento, estilos e emojis

**RF-006:** Indicador de carregamento, diferenciação visual lida/não lida e identificação visual por tipo

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar numa única navegação que a tela exibe loading state, diferencia visualmente notificações lidas e não lidas, e exibe o emoji correto por tipo.

**Pré-condição:** Mock server com mix de notificações lidas/não lidas e pelo menos uma de cada tipo (`APPOINTMENT_CREATED`, `APPOINTMENT_CONFIRMED`, `APPOINTMENT_CANCELLED`, `APPOINTMENT_RESCHEDULED`).

**Passos:**
1. Navegar para a aba "Alertas"
2. Observar o indicador de carregamento (`LoadingState`) aparecer brevemente durante a requisição `GET /notifications`
3. Aguardar a lista renderizar completamente
4. Identificar uma notificação com `read: false` — verificar fundo `accentSoft`, título em negrito (`bodyBold`) e ponto azul no canto superior direito do card
5. Identificar uma notificação com `read: true` — verificar fundo neutro, título em peso normal (`bodyMedium`) e ausência de ponto indicador
6. Localizar na lista uma notificação de cada tipo e verificar o emoji exibido

**Resultado esperado:**
- Estado de carregamento visível enquanto `GET /notifications` está em andamento
- Notificações **não lidas**: fundo `accentSoft`, título em negrito, ponto azul visível
- Notificações **lidas**: fundo neutro, título normal, sem ponto indicador
- `APPOINTMENT_CREATED` → 📅 · `APPOINTMENT_CONFIRMED` → ✅ · `APPOINTMENT_CANCELLED` → ❌ · `APPOINTMENT_RESCHEDULED` → 🔄

**Mídia:** [▶ Cenário 2](assets/mobile/cenarios-de-teste/cenario-teste-2.mp4)

---

### Cenário 3 — Pull-to-refresh atualiza a lista

**RF-006:** Atualização manual da lista de notificações

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que arrastar a lista para baixo recarrega as notificações do servidor.

**Pré-condição:** App na tela "Alertas" com a lista já carregada. Mock server rodando.

**Passos:**
1. Com a lista carregada, editar `src/web/mock-server/data/notifications.json` para incluir uma nova notificação e reiniciar o servidor
2. Na tela do simulador, puxar a lista de notificações para baixo e soltar
3. Observar o `RefreshControl` aparecer durante o recarregamento
4. Verificar que a nova notificação aparece na lista após o refresh

**Resultado esperado:**
- `RefreshControl` (spinner nativo do iOS) visível enquanto recarrega
- Lista atualizada refletindo os dados atuais do mock server após o refresh

**Mídia:** [▶ Cenário 3](assets/mobile/cenarios-de-teste/cenario-teste-3.mp4)

---

### Cenário 4 — Estado vazio quando não há notificações

**RF-006:** Mensagem de estado vazio na ausência de notificações

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar o `EmptyState` exibido quando o usuário não possui nenhuma notificação e que o badge some.

**Pré-condição:** Mock server configurado para retornar lista vazia.

**Passos:**
1. Substituir o conteúdo de `src/web/mock-server/data/notifications.json` por `[]` e reiniciar o servidor
2. Navegar para a aba "Alertas"
3. Aguardar o carregamento completar
4. Observar a tela de estado vazio e o badge na aba

**Resultado esperado:**
- Componente `EmptyState` visível com mensagem informativa
- Nenhum item de lista renderizado
- Badge na aba "Alertas" oculto

**Mídia:** [▶ Cenário 4](assets/mobile/cenarios-de-teste/cenario-teste-4.mp4)

---

## Seção 3 — Interações com Notificações

---

### Cenário 5 — Marcar notificação como lida e reverter para não lida

**RF-006:** Marcação individual de notificação como lida e reversão

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que tocar numa notificação não lida a marca como lida (com atualização visual e chamada à API) e que a mesma notificação pode ser revertida para não lida.

**Pré-condição:** Pelo menos uma notificação com `read: false` presente na lista.

**Passos:**
1. Navegar para a aba "Alertas"
2. Identificar uma notificação com estilo de não lida (fundo `accentSoft`, ponto azul) — anotar o badge atual
3. Tocar na notificação
4. Observar: fundo retorna ao neutro, ponto azul desaparece, badge decrementa em 1
5. Verificar no console do Metro a chamada `PATCH /notifications/:id/read`
6. Tocar novamente na mesma notificação (agora lida)
7. Selecionar a opção de marcar como não lida
8. Observar: fundo volta a `accentSoft`, ponto azul reaparece, badge incrementa em 1
9. Verificar no console do Metro a chamada `PATCH /notifications/:id/unread`

**Resultado esperado:**
- Estilo da notificação muda imediatamente para "lida" ao primeiro toque (sem recarregar a lista)
- Badge da aba decrementado em 1
- Chamada `PATCH /notifications/:id/read` disparada com o ID correto
- Estilo restaurado para "não lida" ao selecionar reverter
- Badge incrementado em 1
- Chamada `PATCH /notifications/:id/unread` disparada com o ID correto

**Mídia:** [▶ Cenário 5](assets/mobile/cenarios-de-teste/cenario-teste-5.mp4)

---

### Cenário 6 — Marcar todas as notificações como lidas

**RF-006:** Marcação em lote de todas as notificações como lidas

**Tela:** `app/(tabs)/notifications.tsx`

**Objetivo:** Demonstrar que o botão "Marcar todas como lidas" aparece quando há não lidas, marca todas em lote, zera e oculta o badge, e desaparece da interface.

**Pré-condição:** Pelo menos duas notificações com `read: false` presentes na lista.

**Passos:**
1. Navegar para a aba "Alertas"
2. Confirmar que o botão "Marcar todas como lidas" está visível no topo da lista
3. Anotar o valor atual do badge
4. Tocar no botão "Marcar todas como lidas"
5. Observar todas as notificações mudarem visualmente para o estilo "lida"
6. Confirmar que o badge da aba zera e fica oculto imediatamente
7. Verificar no console do Metro a chamada `PATCH /notifications/read-all`
8. Confirmar que o botão "Marcar todas como lidas" desapareceu da interface

**Resultado esperado:**
- Botão visível no topo da lista quando há pelo menos uma notificação não lida
- Todas as notificações passam para o estilo "lida" sem recarregar a lista
- Badge zerado e oculto imediatamente após o toque
- Chamada `PATCH /notifications/read-all` disparada
- Botão removido da interface

**Mídia:** [▶ Cenário 6](assets/mobile/cenarios-de-teste/cenario-teste-6.mp4)

---

## Seção 4 — Push Notifications

> **Plataforma para esta seção:** Os cenários CT-007 e CT-008 requerem um **development build** instalado no simulador iOS via `npx expo run:ios`. O Expo Go não suporta push notifications no simulador. O `xcrun simctl push` entrega payloads APNs diretamente ao simulador pelo bundle ID `br.com.medhub.app`, sem depender de credenciais APNs, Expo Push Service ou EAS — equivalente a um push real no nível do sistema operacional.

---

### Cenário 7 — Solicitação de permissão de notificações push

**RF-006:** Solicitação de permissão para recebimento de push notifications

**Tela:** `lib/auth-context.tsx` — `registerForPushNotifications()`

**Objetivo:** Demonstrar que o app solicita permissão de notificações push ao usuário na primeira autenticação e que a resposta não bloqueia o uso do app.

**Pré-condição:** Development build instalado no simulador via `npx expo run:ios`. App com sessão ativa como Ana Paciente.

**Passos:**
1. Resetar as permissões de notificação do MedHub: `Simulator > Privacy & Security > Notifications > MedHub > Reset`
2. Encerrar a sessão no app (logout) e autenticar novamente para disparar `registerForPushNotifications()`
3. Observar o diálogo de permissão de notificações do iOS aparecer automaticamente
4. Conceder a permissão tocando em "Permitir"
5. Verificar no console do Metro que `Push notification permission status: granted` foi registrado

**Resultado esperado:**
- Diálogo de permissão de notificações iOS aparece após a autenticação
- Console do Metro exibe `Push notification permission status: granted`
- O app permanece funcional após o diálogo — falha no registro do token não bloqueia o acesso

**Mídia:** [▶ Cenário 7](assets/mobile/cenarios-de-teste/cenario-teste-7.mp4)

---

### Cenário 8 — Push em foreground e navegação para consulta

**RF-006:** Exibição de notificação push com o app em primeiro plano e navegação ao tocar

**Tela:** App em foreground — `expo-notifications`

**Objetivo:** Demonstrar que o app exibe um banner de notificação ao receber um push enquanto está aberto e navega para o detalhe da consulta ao tocar.

**Pré-condição:** Development build do MedHub aberto em foreground no simulador iOS. Terminal disponível.

**Passos:**
1. Com o app `MedHub` aberto e visível no simulador, abrir o terminal
2. Criar o arquivo de payload APNs:
   ```bash
   cat > /tmp/medhub-push.apns << 'EOF'
   {
     "aps": {
       "alert": {
         "title": "Consulta confirmada",
         "body": "Sua consulta com Dr. Carlos foi confirmada."
       },
       "sound": "default"
     },
     "appointmentId": "a-02"
   }
   EOF
   ```
3. Enviar o push ao simulador:
   ```bash
   DEVICE=$(xcrun simctl list devices | grep Booted | grep -oE '[A-F0-9-]{36}' | head -1)
   xcrun simctl push $DEVICE br.com.medhub.app /tmp/medhub-push.apns
   ```
4. Observar o banner de notificação aparecer sobre o app
5. Tocar no banner e verificar a navegação para o detalhe da consulta `a-02`

**Resultado esperado:**
- Comando `xcrun simctl push` retorna sem erro
- Banner de notificação visível no topo da tela com título "Consulta confirmada" e corpo corretos
- Ao tocar no banner, o app navega diretamente para o detalhe da consulta `a-02`

**Mídia:** [▶ Cenário 8](assets/mobile/cenarios-de-teste/cenario-teste-8.mp4)
