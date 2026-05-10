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
Acesse o link abaixo para assistir aos testes de CRUD das clínicas:

https://drive.google.com/drive/folders/18iHGRhT0ZqUu6gODA7eA-7pIZfTqqbR_?usp=sharing

# 🧪 Relatório de Testes: Unidades de Saúde (RF-007)

Este documento registra as validações realizadas no módulo de gerenciamento de clínicas do MedHub, garantindo a integração entre o frontend e o servidor de mock.

## 1. Configuração do Ambiente
* **Backend:** Node.js (Express) operando na porta 3001.
* **Banco de Dados (Simulado):** Arquivo `clinics.json`.
* **Frontend:** Aplicação React rodando via Vite (porta 5173).

## 2. Cenários de Teste Realizados

### Fase 1: Consumo de API (Listagem)
* **Objetivo:** Validar se a tabela carrega os dados reais do arquivo JSON.
* **Resultado:** O sistema realizou a requisição GET com sucesso e renderizou as clínicas (Pedro I, Eldorado, Mater Dei) na interface.
* **Status:** ✅ Aprovado.

### Fase 2: Operação de Edição (Update)
* **Objetivo:** Verificar se a alteração de uma clínica é enviada e salva corretamente.
* **Procedimento:** Alteração de telefone e endereço de uma unidade existente através do formulário de edição.
* **Resultado:** O alerta de sucesso foi exibido e a tabela atualizou instantaneamente.
* **Status:** ✅ Aprovado.

### Fase 3: Persistência de Dados
* **Objetivo:** Garantir que a informação não se perca ao recarregar a página.
* **Resultado:** Após o refresh (F5), os dados alterados permaneceram na tela, confirmando a atualização física no arquivo `clinics.json`.
* **Status:** ✅ Aprovado.

---
