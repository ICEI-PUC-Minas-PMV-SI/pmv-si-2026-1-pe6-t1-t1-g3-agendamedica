# 🧪 Cenários de Teste - Módulo de Clínicas

Este documento descreve os testes realizados para validar o gerenciamento de clínicas.

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