# Introdução

Texto descritivo com a visão geral do projeto abordado. Inclui o contexto, o problema, os objetivos, a justificativa e o público-alvo do projeto.

## Problema

O setor de saúde sofre com uma infraestrutura de dados bastante fragmentada. É comum que os pacientes precisem de acompanhamento com vários especialistas que, por sua vez, atendem em diferentes clínicas, hospitais e consultórios. Atualmente, os sistemas de gestão dessas instituições funcionam de forma isolada; cada local utiliza o seu próprio software de agendamento, que muitas vezes é legado e não se comunica com as ferramentas de outras clínicas.

O problema central deste projeto é justamente a falta de integração e a gestão descentralizada das agendas médicas. Essa desconexão entre os sistemas gera ineficiências graves no dia a dia.

Para os pacientes, marcar consultas é um processo demorado e ineficiente. Eles precisam entrar em contato individualmente com cada clínica, seja por telefone, WhatsApp ou sites diferentes, apenas para tentar conciliar um horário disponível com o médico que procuram.

Para os profissionais de saúde que dividem seu tempo entre vários locais, esse isolamento dos sistemas prejudica o controle da própria agenda. O grande obstáculo é o desperdício de horários vagos. Por exemplo: se um paciente cancela uma consulta na Clínica A, essa janela de tempo fica ociosa. Como não há uma visão unificada da agenda global do médico, a Clínica B não tem como saber que aquele horário vagou para oferecê-lo rapidamente a outro paciente.

No fim das contas, a falta de sincronização entre os diferentes pontos de atendimento gera informações desatualizadas, desperdiça o tempo útil dos médicos e dificulta o acesso rápido dos pacientes aos serviços de saúde.

## Objetivos

Aqui você deve descrever os objetivos do trabalho indicando que o objetivo geral é desenvolver um software para solucionar o problema apresentado acima. 

Apresente também alguns (pelo menos 2) objetivos específicos dependendo de onde você vai querer concentrar a sua prática investigativa, ou como você vai aprofundar no seu trabalho.
 
> **Links Úteis**:
> - [Objetivo geral e objetivo específico: como fazer e quais verbos utilizar](https://blog.mettzer.com/diferenca-entre-objetivo-geral-e-objetivo-especifico/)

## Justificativa

Descreva a importância ou a motivação para trabalhar com esta aplicação que você escolheu. Indique as razões pelas quais você escolheu seus objetivos específicos ou as razões para aprofundar em certos aspectos do software.

O grupo de trabalho pode fazer uso de questionários, entrevistas e dados estatísticos, que podem ser apresentados, com o objetivo de esclarecer detalhes do problema que será abordado pelo grupo.

> **Links Úteis**:
> - [Como montar a justificativa](https://guiadamonografia.com.br/como-montar-justificativa-do-tcc/)

## Público-Alvo

Proficionais da área de saúde:
Os profissionais de saúde possuem experiência prévia com sistemas de prontuário eletrônico e plataformas de gestão hospitalar. Para esses, o impacto é a unificação da vida profissional. Estão habituados ao uso de ferramentas digitais no cotidiano, mas enfrentam dificuldades ao conciliar agendas em diferentes instituições, pois muitos dividem o dia entre consultórios próprios, hospitais e clínicas de terceiros.  Por isso, precisam de uma solução integrada que facilite o gerenciamento de compromissos, evitando assim o estresse de conflitos de horários, diminuindo também o problema do tempo ocioso pela desmarcação de consultas em cima da hora. 

Corpo administrativo:
O corpo administrativo possui experiência com sistemas de agendamento e gestão de pacientes, mas muitas vezes em plataformas pouco integradas. Necessitam de uma ferramenta que simplifique os processos, reduza falhas e a carga de trabalho manual,  apoie diretamente na organização das agendas dos profissionais de saúde.

Pacientes:
O grupo dos pacientes é composto por um espectro diverso que vai desde jovens e adultos com alta familiaridade digital, que buscam resolver tudo pelo smartphone com poucos cliques, até idosos com menor domínio tecnológico, que podem se sentir intimidados por interfaces complexas e que também podem enfrentar dificuldades no processo de agendamento e verificação de consultas. Em comum, todos necessitam de uma solução que proporcione praticidade, rapidez e simplicidade.



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

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.
