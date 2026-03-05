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

A gestão de agendas médicas no Brasil enfrenta sérios desafios de interoperabilidade e sincronização entre diferentes clínicas, hospitais e consultórios. Segundo levantamento da Associação Nacional de Hospitais Privados (ANAHP), cerca de 42% das instituições privadas relatam dificuldades recorrentes na confirmação de consultas, o que gera perdas financeiras que podem ultrapassar R$ 140 mil anuais por clínica, em decorrência de horários vagos e cancelamentos não gerenciados (ANAHP, 2022).

No âmbito público, dados do Ministério da Saúde indicam que, em 2023, 3 em cada 10 pacientes faltaram a consultas ou exames sem realizar desmarcação prévia, comprometendo diretamente a eficiência do Sistema Único de Saúde (SUS) (Ministério da Saúde, 2023).

Além disso, plataformas de reclamação como o Reclame Aqui evidenciam a insatisfação dos pacientes em relação aos processos de agendamento. As queixas mais frequentes incluem dificuldade de contato com clínicas, demora nas respostas via canais digitais, como WhatsApp, e ausência de integração entre sistemas de atendimento (RECLAME AQUI, 2023).

Diante desse cenário, a implementação de um sistema distribuído de agenda médica não atende exclusivamente às demandas técnicas de interoperabilidade, escalabilidade e segurança, como também se configura como uma solução estratégica para reduzir perdas financeiras, melhorar a experiência do paciente e aumentar a eficiência operacional do setor de saúde no Brasil.

Fontes disponíveis em: [Referências](./Referências)

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

| ID     | Descrição do Requisito                  | Prioridade |
| ------ | --------------------------------------- | ---------- |
| RF-001 | Permitir que o usuário cadastre tarefas | ALTA       |
| RF-002 | Emitir um relatório de tarefas no mês   | MÉDIA      |

### Requisitos não Funcionais

| ID      | Descrição do Requisito                                            | Prioridade |
| ------- | ----------------------------------------------------------------- | ---------- |
| RNF-001 | O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA      |
| RNF-002 | Deve processar requisições do usuário em no máximo 3s             | BAIXA      |

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

| ID  | Restrição                                             |
| --- | ----------------------------------------------------- |
| 01  | O projeto deverá ser entregue até o final do semestre |
| 02  | Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços

Os serviços de Tecnologia da Informação do MedHub foram pensados para apoiar diretamente os objetivos estratégicos da organização. A TI atua como uma parceira do negócio, oferecendo suporte e soluções que facilitam o acesso e o uso adequado dos recursos tecnológicos sempre que necessário.

A seguir, apresentamos os serviços de TI disponibilizados pelo MedHub e como eles podem apoiar as atividades dos usuários.

# Catálogo de Serviços – MedHub

| Serviço | Descrição | Público-alvo | Benefícios | Nível de Serviço | Solicitação |
|--------|-----------|--------------|------------|------------------|-------------|
| Agendamento de Consulta | Permite que pacientes agendem consultas médicas diretamente pelo aplicativo MedHub, escolhendo profissional, especialidade e horário disponível. | Pacientes e corpo administrativo | Reduz tempo de agendamento, diminui dependência de atendimento telefônico e melhora a organização da agenda médica. | Disponível continuamente via aplicativo com atualização automática dos horários disponíveis. | Acesso direto no aplicativo MedHub pela opção **Agendar Consulta**. |
| Consulta de Agenda Médica | Permite que pacientes e profissionais visualizem consultas agendadas e horários disponíveis de forma centralizada. | Pacientes e profissionais de saúde | Melhor planejamento da agenda, redução de conflitos de horário e maior transparência das consultas. | Disponível continuamente no aplicativo a agenda. | Acesso pela seção **Minhas Consultas** no aplicativo. |
| Cancelamento e Remarcação de Consultas | Permite cancelar ou alterar consultas previamente agendadas diretamente pelo aplicativo. | Pacientes e corpo administrativo | Maior flexibilidade para alteração de compromissos, redução de faltas e otimização da agenda médica. | Disponível continuamente com atualização automática após alterações na agenda. | Realizado pela seção **Minhas Consultas** no aplicativo MedHub. |
| Notificações e Alertas de Consulta | Envia notificações automáticas quando consultas são criadas, alteradas ou canceladas, além de lembretes antes do horário da consulta. | Todos | Redução de esquecimentos e melhoria na comunicação entre sistema e usuários. | Notificações enviadas automaticamente via aplicativo | Ativado automaticamente para usuários do aplicativo MedHub. | | Autenticação de Usuário (Login) | Permite que usuários acessem o sistema MedHub utilizando suas credenciais cadastradas, garantindo acesso seguro às funcionalidades da plataforma. | Todos | Controle de acesso ao sistema, proteção das informações do usuário e personalização da experiência dentro do aplicativo. | Disponível continuamente no aplicativo MedHub com validação segura de credenciais. | Acesso realizado pela tela de **Login** do aplicativo. |
| Recuperação de Senha | Permite que usuários redefinam sua senha caso a tenham esquecido, através de um processo de recuperação seguro. | Todos | Recuperação rápida do acesso ao sistema e redução de bloqueios de conta. | Disponível continuamente através do aplicativo ou página de login. | Acesso pela opção **Esqueci minha senha** na tela de login. |


# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.
