# Introdução

A gestão de agendas médicas é parte fundamental da organização dos serviços de saúde, envolvendo o controle de horários, profissionais e atendimentos em diferentes unidades. Com a informatização desses processos, clínicas e hospitais passaram a utilizar sistemas digitais para realizar o agendamento e o acompanhamento de consultas.

Em contextos nos quais profissionais atuam em mais de uma instituição, ou em que diferentes unidades utilizam sistemas distintos, surgem dificuldades na integração das informações, gerando inconsistências, duplicidade de dados e falta de coordenação entre agendas médicas. Nesse cenário, conceitos de sistemas distribuídos tornam-se relevantes para permitir o compartilhamento estruturado de dados entre serviços independentes.

A aplicação desses conceitos possibilita a construção de soluções baseadas em múltiplos componentes que se comunicam por meio de APIs, mantendo organização, controle e consistência das informações relacionadas às agendas médicas.

A proposta destina-se a profissionais de saúde, equipes administrativas de clínicas e hospitais e pacientes que dependem de processos de agendamento eficientes e integrados.

## Problema

O setor de saúde sofre com uma infraestrutura de dados bastante fragmentada. É comum que os pacientes precisem de acompanhamento com vários especialistas que, por sua vez, atendem em diferentes clínicas, hospitais e consultórios. Atualmente, os sistemas de gestão dessas instituições funcionam de forma isolada; cada local utiliza o seu próprio software de agendamento, que muitas vezes é legado e não se comunica com as ferramentas de outras clínicas.

O problema central deste projeto é justamente a falta de integração e a gestão descentralizada das agendas médicas. Essa desconexão entre os sistemas gera ineficiências graves no dia a dia.

Para os pacientes, marcar consultas é um processo demorado e ineficiente. Eles precisam entrar em contato individualmente com cada clínica, seja por telefone, WhatsApp ou sites diferentes, apenas para tentar conciliar um horário disponível com o médico que procuram.

Para os profissionais de saúde que dividem seu tempo entre vários locais, esse isolamento dos sistemas prejudica o controle da própria agenda. O grande obstáculo é o desperdício de horários vagos. Por exemplo: se um paciente cancela uma consulta na Clínica A, essa janela de tempo fica ociosa. Como não há uma visão unificada da agenda global do médico, a Clínica B não tem como saber que aquele horário vagou para oferecê-lo rapidamente a outro paciente.

No fim das contas, a falta de sincronização entre os diferentes pontos de atendimento gera informações desatualizadas, desperdiça o tempo útil dos médicos e dificulta o acesso rápido dos pacientes aos serviços de saúde.

## Objetivos
Desenvolver um sistema de agenda médica online que permita aos pacientes visualizar horários disponíveis e agendar consultas, enquanto médicos podem cadastrar serviços e disponibilizar seus horários de atendimento.

### Objetivos específicos
- Desenvolver uma aplicação web para que pacientes e médicos possam acessar o sistema.

- Permitir o cadastro e gerenciamento de médicos na plataforma.

- Permitir que médicos cadastrem os serviços oferecidos.

- Permitir que médicos disponibilizem horários para atendimento.

- Permitir que pacientes visualizem horários disponíveis e realizem agendamentos de consultas.

- Armazenar e gerenciar as informações do sistema em um banco de dados.

- Desenvolver uma API para comunicação entre a aplicação web e o banco de dados.

## Justificativa

A gestão de agendas médicas no Brasil enfrenta sérios desafios de interoperabilidade e sincronização entre diferentes clínicas, hospitais e consultórios. Segundo levantamento da Associação Nacional de Hospitais Privados (ANAHP), cerca de 42% das instituições privadas relatam dificuldades recorrentes na confirmação de consultas, o que gera perdas financeiras que podem ultrapassar R$ 140 mil anuais por clínica, em decorrência de horários vagos e cancelamentos não gerenciados (ANAHP, 2022).

No âmbito público, dados do Ministério da Saúde indicam que, em 2023, 3 em cada 10 pacientes faltaram a consultas ou exames sem realizar desmarcação prévia, comprometendo diretamente a eficiência do Sistema Único de Saúde (SUS) (Ministério da Saúde, 2023).

Além disso, plataformas de reclamação como o Reclame Aqui evidenciam a insatisfação dos pacientes em relação aos processos de agendamento. As queixas mais frequentes incluem dificuldade de contato com clínicas, demora nas respostas via canais digitais, como WhatsApp, e ausência de integração entre sistemas de atendimento (RECLAME AQUI, 2023).

Diante desse cenário, a implementação de um sistema distribuído de agenda médica não atende exclusivamente às demandas técnicas de interoperabilidade, escalabilidade e segurança, como também se configura como uma solução estratégica para reduzir perdas financeiras, melhorar a experiência do paciente e aumentar a eficiência operacional do setor de saúde no Brasil.

Fontes disponíveis em: [Referências](./referencia.md)

## Público-Alvo

- Profissionais da área de saúde:
Os profissionais de saúde possuem experiência prévia com sistemas de prontuário eletrônico e plataformas de gestão hospitalar. Para esses, o impacto é a unificação da vida profissional. Estão habituados ao uso de ferramentas digitais no cotidiano, mas enfrentam dificuldades ao conciliar agendas em diferentes instituições, pois muitos dividem o dia entre consultórios próprios, hospitais e clínicas de terceiros.  Por isso, precisam de uma solução integrada que facilite o gerenciamento de compromissos, evitando assim o estresse de conflitos de horários, diminuindo também o problema do tempo ocioso pela desmarcação de consultas em cima da hora. 

- Corpo administrativo:
O corpo administrativo possui experiência com sistemas de agendamento e gestão de pacientes, mas muitas vezes em plataformas pouco integradas. Necessitam de uma ferramenta que simplifique os processos, reduza falhas e a carga de trabalho manual,  apoie diretamente na organização das agendas dos profissionais de saúde.

- Pacientes:
O grupo dos pacientes é composto por um espectro diverso que vai desde jovens e adultos com alta familiaridade digital, que buscam resolver tudo pelo smartphone com poucos cliques, até idosos com menor domínio tecnológico, que podem se sentir intimidados por interfaces complexas e que também podem enfrentar dificuldades no processo de agendamento e verificação de consultas. Em comum, todos necessitam de uma solução que proporcione praticidade, rapidez e simplicidade.



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
