# Cenários de Teste - Módulo de Clínicas

Este documento descreve os testes realizados para validar o gerenciamento de clínicas.

Execução de requisição POST via Thunder Client para o endpoint /clinics. Uma imagem demonstra o envio do payload JSON (topo) e a resposta do servidor com o Status HTTP 201 (Created), confirmando a persistência dos dados no banco PostgreSQL e a geração automática do UUID para a nova clínica.

## 1. Cadastro de Nova Clínica
**Objetivo:** Verificar se o sistema permite a criação de uma clínica com dados válidos.
- **Tipo de Teste:** Integração / API
- **Método:** `POST`
- **URL:** `http://localhost:3000/clinics`
- **Payload Enviado:**
  ```json
  {
    "name": "Clinica Belo Horizonte",
    "address": "Rua da Bahia, 123",
    "phone": "31999999999"
  }
  Resultado Esperado: Status 201 Created e retorno do objeto com ID gerado.

Resultado Obtido: Sucesso (Status 201).

## 2. Listagem de Clínicas
Objetivo: Validar se a API retorna a lista de clínicas cadastradas no banco.

Método: GET

URL: http://localhost:3000/clinics

Resultado Esperado: Status 200 OK e um array de objetos.

Resultado Obtido: Sucesso.

## Evidências (Prints)
O teste foi realizado utilizando a extensão Thunder Client no VS Code.
Nota: Os prints de execução foram anexados ao Pull Request #39 para conferência do grupo.
<img width="1588" height="805" alt="Testes - API clinicas" src="https://github.com/user-attachments/assets/da94c4bd-9e59-43e2-b868-25830208daca" />

![Teste de Cadastro](./img/Post.png)

![Teste de Atualização](./img/Patch.png)

### 🎥 Teste Frontend: Demonstração em Vídeo da Edição e Cadastro de novas clínicas
Acesso o link abaixo para assistir aos testes de CRUD das clínicas:

https://drive.google.com/drive/folders/18iHGRhT0ZqUu6gODA7eA-7pIZfTqqbR_?usp=sharing

1. Preparação do Ambiente de Teste
Para a execução dos cenários abaixo, o ambiente foi configurado da seguinte forma:

Backend: Node.js rodando na porta 3001 consumindo o arquivo clinics.json.
Frontend: Aplicação Vite/React rodando na porta 5173.
Ferramentas de Apoio: Thunder Client (para testes de endpoint) e Console do Desenvolvedor (Chrome DevTools).

Passo a Passo dos Testes Realizados
Fase 1: Testes de API
Objetivo: Validar se os endpoints estão respondendo corretamente antes de testar a interface.
Ação: Utilização do Thunder Client para disparar requisições para http://localhost:3001/clinics.
Resultado esperado: Recebimento de Status 200 OK na listagem e 201 Created no cadastro.

Fase 2: Teste de Listagem Dinâmica (Read)
Objetivo: Verificar se a tabela de unidades de saúde carrega os dados reais do arquivo JSON.
Ação: Acessar a rota de "Unidades de Saúde" no sistema MedHub.
Evidência: O sistema disparou um GET e renderizou as clínicas (ex: Clínica OrtoPed, Eldorado) conforme populado no arquivo clinics.json.

Fase 3: Teste de Fluxo de Edição (Update)
Objetivo: Validar se a alteração de dados de uma clínica é processada e enviada corretamente.
Ação: 1. Clicar no botão Editar de uma clínica específica.
1. Alterar o campo "Nome" ou "Endereço".
2. Clicar em Salvar Alterações.
Resultado esperado: Exibição do alerta de confirmação e retorno automático para a tela de listagem com o dado atualizado.

Fase 4: Teste de Persistência e Integridade
Objetivo: Garantir que o dado não se perca ao recarregar a aplicação (F5).
Ação: Após a edição, realizar o refresh da página no navegador e verificar o arquivo físico clinics.json no VS Code.
Evidência: O arquivo JSON foi sobrescrito com a nova informação, confirmando que a rota PUT no server.js funcionou.


