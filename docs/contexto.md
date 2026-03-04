# Introdução

Texto descritivo com a visão geral do projeto abordado. Inclui o contexto, o problema, os objetivos, a justificativa e o público-alvo do projeto.

## Problema

O setor de saúde sofre com uma infraestrutura de dados bastante fragmentada. É comum que os pacientes precisem de acompanhamento com vários especialistas que, por sua vez, atendem em diferentes clínicas, hospitais e consultórios. Atualmente, os sistemas de gestão dessas instituições funcionam de forma isolada; cada local utiliza o seu próprio software de agendamento, que muitas vezes é legado e não se comunica com as ferramentas de outras clínicas.

O problema central deste projeto é justamente a falta de integração e a gestão descentralizada das agendas médicas. Essa desconexão entre os sistemas gera ineficiências graves no dia a dia.

Para os pacientes, marcar consultas é um processo demorado e ineficiente. Eles precisam entrar em contato individualmente com cada clínica, seja por telefone, WhatsApp ou sites diferentes, apenas para tentar conciliar um horário disponível com o médico que procuram.

Para os profissionais de saúde que dividem seu tempo entre vários locais, esse isolamento dos sistemas prejudica o controle da própria agenda. O grande obstáculo é o desperdício de horários vagos. Por exemplo: se um paciente cancela uma consulta na Clínica A, essa janela de tempo fica ociosa. Como não há uma visão unificada da agenda global do médico, a Clínica B não tem como saber que aquele horário vagou para oferecê-lo rapidamente a outro paciente.

No fim das contas, a falta de sincronização entre os diferentes pontos de atendimento gera informações desatualizadas, desperdiça o tempo útil dos médicos e dificulta o acesso rápido dos pacientes aos serviços de saúde.

## Objetivos

### Objetivo geral
Desenvolver um sistema distribuído de agenda médica que permita o compartilhamento de horários entre diferentes unidades de atendimento, oferecendo uma visualização centralizada da agenda dos profissionais de saúde.

### Objetivos específicos
- Projetar uma arquitetura distribuída composta por múltiplos serviços independentes que compartilham informações de agenda por meio de comunicação via API.

- Implementar um mecanismo de sincronização periódica de dados entre os serviços, evitando conflitos de horário de forma controlada.

- Garantir consistência dos dados por meio de validações no momento do agendamento, prevenindo duplicidade de horários.

- Desenvolver uma interface simples para visualização e marcação de consultas, demonstrando o funcionamento do sistema distribuído.

## Justificativa

Descreva a importância ou a motivação para trabalhar com esta aplicação que você escolheu. Indique as razões pelas quais você escolheu seus objetivos específicos ou as razões para aprofundar em certos aspectos do software.

O grupo de trabalho pode fazer uso de questionários, entrevistas e dados estatísticos, que podem ser apresentados, com o objetivo de esclarecer detalhes do problema que será abordado pelo grupo.

> **Links Úteis**:
> - [Como montar a justificativa](https://guiadamonografia.com.br/como-montar-justificativa-do-tcc/)

## Público-Alvo

Descreva quem serão as pessoas que usarão a sua aplicação indicando os diferentes perfis. O objetivo aqui não é definir quem serão os clientes ou quais serão os papéis dos usuários na aplicação. A ideia é, dentro do possível, conhecer um pouco mais sobre o perfil dos usuários: conhecimentos prévios, relação com a tecnologia, relações
hierárquicas, etc.

Adicione informações sobre o público-alvo por meio de uma descrição textual, diagramas de personas e mapa de stakeholders.

> **Links Úteis**:
> - [Público-alvo](https://blog.hotmart.com/pt-br/publico-alvo/)
> - [Como definir o público alvo](https://exame.com/pme/5-dicas-essenciais-para-definir-o-publico-alvo-do-seu-negocio/)
> - [Público-alvo: o que é, tipos, como definir seu público e exemplos](https://klickpages.com.br/blog/publico-alvo-o-que-e/)
> - [Qual a diferença entre público-alvo e persona?](https://rockcontent.com/blog/diferenca-publico-alvo-e-persona/)

# Especificações do Projeto

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

| ID     | Descrição do Requisito                                                                                          | Prioridade |
| ------ | --------------------------------------------------------------------------------------------------------------- | ---------- |
| RF-001 | O sistema deve permitir que os pacientes agendem, visualizem e cancelem consultas médicas pelo aplicativo.      | ALTA       |
| RF-002 | O sistema deve permitir que médicos e recepcionistas gerenciem a agenda de marcações através da interface web.  | ALTA       |
| RF-003 | O sistema deve sincronizar as informações de consultas entre as aplicações web e móvel de maneira centralizada. | ALTA       |
| RF-004 | O sistema deve permitir o cadastro e o login de todos os usuários (pacientes, médicos e recepcionistas).        | ALTA       |
| RF-005 | O sistema deve notificar os usuários caso ocorra um cancelamento de consulta.                                   | MÉDIA      |

### Requisitos não Funcionais

| ID      | Descrição do Requisito                                                                                                                                      | Prioridade |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RNF-001 | A comunicação entre as aplicações (web e mobile) e o servidor deve ser padronizada por meio de uma API REST.                                                | ALTA       |
| RNF-002 | O sistema deve possuir tempo de resposta até 3 segundos para pesquisas e ações na agenda.                                                                   | MÉDIA      |
| RNF-003 | A interface web deve ser responsiva para se adaptar e funcionar corretamente em diferentes tamanhos de tela.                                                | ALTA       |
| RNF-004 | O aplicativo móvel deve ser compatível com as plataformas Android e iOS.                                                                                    | ALTA       |
| RNF-005 | O sistema deve utilizar tokens JWT para garantir a autenticação e autorização segura em todas as requisições entre as aplicações e a API.                   | ALTA       |
| RNF-006 | O sistema deve ser compatível com as versões mais recentes dos principais navegadores do mercado (Google Chrome, Mozilla Firefox, Safari e Microsoft Edge). | ALTA       |

## Restrições

O projeto está restrito pelas condições e limitações apresentadas na tabela a seguir:

| ID  | Restrição                                                                                              |
| --- | ------------------------------------------------------------------------------------------------------ |
| 01  | O projeto deverá ser entregue dentro do prazo estabelecido até o final do semestre letivo.             |
| 02  | O fluxo do sistema deve focar apenas no agendamento, não contemplando a gestão de prontuários médicos. |
| 03  | O sistema não realiza processamento de pagamentos ou cobranças pelos serviços médicos.                 |
| 04  | O sistema não deve permitir o agendamento de consultas sem validação do perfil do usuário.             |
| 05  | O sistema não deve permitir o agendamento de consultas para o mesmo médico em horários iguais.         |
| 06  | O sistema deve permitir apenas 1 cadastro por CPF e e-mail.                                            |


> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.
