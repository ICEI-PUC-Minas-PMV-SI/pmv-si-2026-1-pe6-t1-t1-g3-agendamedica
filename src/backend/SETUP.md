# MedHub — Backend: Guia de Configuração e Execução

## Pré-requisitos

| Ferramenta     | Versão mínima | Como verificar           |
| -------------- | ------------- | ------------------------ |
| Node.js        | 22.x LTS      | `node -v`                |
| npm            | 9+            | `npm -v`                 |
| Docker         | 24+           | `docker -v`              |
| Docker Compose | v2 (plugin)   | `docker compose version` |
| VS Code        | qualquer      | —                        |

> **Nota sobre Node.js:** Para gerenciar versões, use [nvm](https://github.com/nvm-sh/nvm):
> ```bash
> nvm install 22 && nvm use 22
> ```

---

## 1. Extensões recomendadas (VS Code)

O repositório inclui `.vscode/extensions.json` com as extensões do projeto. Ao abrir a pasta no VS Code, ele vai sugerir instalá-las automaticamente. Caso não apareça a notificação, instale manualmente:

| Extensão                     | Função                                                 |
| ---------------------------- | ------------------------------------------------------ |
| `Prisma.prisma`              | Syntax highlight e format do `schema.prisma`           |
| `dbaeumer.vscode-eslint`     | Mostra erros de lint inline e corrige ao salvar        |
| `esbenp.prettier-vscode`     | Formata TypeScript, JS e JSON ao salvar                |
| `usernamehw.errorlens`       | Exibe mensagens de erro diretamente na linha do código |
| `yoavbls.pretty-ts-errors`   | Torna os erros TypeScript legíveis                     |
| `yzhang.markdown-all-in-one` | Preview e formatação de Markdown                       |

Com essas extensões, **lint e formatação rodam automaticamente ao salvar** — não é necessário executar `npm run lint` ou `npm run format` manualmente durante o desenvolvimento.

---

## 2. Instalar dependências

```bash
cd src/backend
npm install
```

---

## 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

O `.env.example` já vem configurado para o banco Docker. Ajuste apenas os valores de JWT e SMTP:

```env
# Banco — já corresponde ao docker-compose.yml, não precisa alterar
DATABASE_URL=postgresql://medhub:medhub@localhost:5432/medhub

# Gere uma string longa e aleatória (ex: openssl rand -hex 32)
JWT_SECRET=troque_por_uma_chave_segura
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development

# SMTP para e-mails — use Mailtrap em desenvolvimento (mailtrap.io)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=seu_usuario_mailtrap
SMTP_PASS=sua_senha_mailtrap
EMAIL_FROM=no-reply@medhub.app
```

---

## 4. Subir o banco com Docker

```bash
docker compose up -d
```

Verifique se o container está rodando:

```bash
docker compose ps
```

Saída esperada:

```
NAME          STATUS          PORTS
medhub-db     Up X seconds    0.0.0.0:5432->5432/tcp
```

> Para parar o banco sem perder os dados: `docker compose stop`
> Para remover o container e os dados: `docker compose down -v`

---

## 5. Executar as migrations

Cria as tabelas no banco a partir do schema Prisma:

```bash
npx prisma migrate dev --name init
```

Saída esperada:

```
Applying migration `20260318000000_init`
Your database is now in sync with your schema.
```

---

## 6. (Opcional) Inspecionar o banco com Prisma Studio

```bash
npx prisma studio
```

Acesse em `http://localhost:5555`. Verifique se as tabelas `User`, `Doctor`, `Clinic`, `Appointment` e `Notification` foram criadas.

---

## 7. Iniciar o servidor

```bash
npm run dev
```

Saída esperada:

```json
{"level":"info","ts":"...","message":"MedHub API iniciada","meta":{"port":3000,"env":"development"}}
```

---

## 8. Verificar que está funcionando

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{"status":"ok"}
```
