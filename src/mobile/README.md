# MedHub Mobile

Aplicativo móvel do MedHub para pacientes — desenvolvido com React Native e Expo.

## Pré-requisitos

| Ferramenta | Versão mínima | Verificar |
| --- | --- | --- |
| Node.js | 22.x LTS | `node -v` |
| npm | 9+ | `npm -v` |
| Expo Go (app no celular) | — | [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) |

## Como rodar

### 1. Instalar dependências

```bash
cd src/mobile
npm install
```

### 2. Iniciar o mock server

O app consome o mock server do frontend web. Em um terminal separado:

```bash
cd src/web/mock-server
node server.js
```

O servidor sobe em `http://localhost:3000`.

### 3. Iniciar o app

```bash
npx expo start
```

Escaneie o QR Code com o **Expo Go** no celular, ou pressione:

- `i` — abre no simulador iOS (macOS + Xcode necessário)
- `a` — abre no emulador Android (Android Studio necessário)

> **Android Emulator:** o app detecta automaticamente o sistema operacional e usa `http://10.0.2.2:3000` para acessar o mock server rodando no host.

## Credenciais de teste

Use qualquer usuário do arquivo `src/web/mock-server/data/user.json`, ou cadastre uma nova conta pelo próprio app (papel fixo: Paciente).

## Estrutura

```
src/mobile/
  app/              # Telas (Expo Router — roteamento por arquivo)
    auth/           # Login e cadastro
    (tabs)/         # Início, Consultas, Notificações, Perfil
    appointment/    # Detalhe e agendamento de consultas
  components/       # Componentes reutilizáveis
    ui/             # Button, Card, Badge, Input, Avatar, etc.
  lib/              # Lógica compartilhada
    tokens.ts       # Design tokens (cores, espaçamento, tipografia)
    api.ts          # Cliente HTTP (aponta para o mock server)
    auth-context.tsx
    types.ts
    utils.ts
```

## Documentação completa

Consulte [`docs/frontend-mobile.md`](../../docs/frontend-mobile.md) para a documentação técnica completa do projeto.
