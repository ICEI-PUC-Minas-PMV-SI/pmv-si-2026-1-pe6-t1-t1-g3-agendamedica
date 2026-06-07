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
