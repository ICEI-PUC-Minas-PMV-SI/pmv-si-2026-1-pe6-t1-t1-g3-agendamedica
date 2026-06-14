# Apresentação da Solução — MedHub

## Resumo do Processo de Desenvolvimento

O **MedHub** é uma plataforma distribuída de agendamento médico desenvolvida ao longo do semestre como projeto da disciplina de Aplicações Distribuídas, no curso de Sistemas de Informação da PUC Minas.

### Etapa 1 — Contextualização e Requisitos

O ponto de partida foi a identificação de um problema real: a fragmentação dos sistemas de agendamento no setor de saúde brasileiro. Clínicas e hospitais operam com softwares isolados, obrigando pacientes a ligar para cada local separadamente e impedindo que médicos que atuam em múltiplos locais tenham visão unificada de sua agenda. Isso gera conflitos de horário, desperdício de slots vagos e insatisfação generalizada.

A partir desse diagnóstico, o grupo definiu os objetivos do sistema, mapeou os três perfis de usuário — **pacientes**, **profissionais de saúde** e **corpo administrativo** — e especificou os requisitos funcionais e não funcionais que guiariam todo o desenvolvimento. Também foi elaborado o **Catálogo de Serviços MedHub**, documentando os seis serviços principais da plataforma: Agendamento, Consulta de Agenda, Cancelamento/Remarcação, Notificações, Autenticação e Recuperação de Senha.

### Etapa 2 — Backend e API REST

Com os requisitos definidos, o grupo projetou a arquitetura do sistema: uma **arquitetura distribuída de três camadas** (frontend web, frontend mobile e backend), onde toda comunicação entre clientes e banco de dados passa obrigatoriamente pela API, sem acesso direto.

O modelo de dados foi estruturado em cinco entidades principais: **USER**, **DOCTOR**, **CLINIC**, **APPOINTMENT** e **NOTIFICATION**. A API REST foi desenvolvida em **Node.js com Express e TypeScript**, utilizando **Prisma ORM** para acesso ao **PostgreSQL**, autenticação **stateless via JWT**, validação de schemas com **Zod** e envio de e-mails com **Nodemailer**.

Todos os endpoints foram documentados e testados, cobrindo os módulos de autenticação, gestão de usuários, médicos, clínicas, agendamentos e notificações.

### Etapa 3 — Frontend Web

O frontend web foi construído com **React, Vite e TypeScript**, utilizando **Tailwind CSS** para estilização e **React Router** para navegação. A interface é voltada principalmente para médicos e recepcionistas, oferecendo funcionalidades de gestão de agenda, visualização de pacientes e controle de horários disponíveis. O design priorizou responsividade e acessibilidade, garantindo funcionamento nos principais navegadores do mercado.

### Etapa 4 — Frontend Mobile

O aplicativo mobile foi desenvolvido com **React Native e Expo**, voltado principalmente para pacientes. Através do app, o usuário pode buscar médicos por especialidade, visualizar horários disponíveis, agendar, cancelar e remarcar consultas, além de receber **notificações push** sobre o status dos agendamentos. O app é compatível com Android e iOS e utiliza o mesmo conjunto de endpoints da API REST.

### Infraestrutura e Hospedagem

A plataforma foi projetada para produção na **Amazon Web Services (AWS)**: o backend roda em **EC2**, o banco de dados em **RDS PostgreSQL**, o frontend web é servido via **S3 + CloudFront** e o app mobile é distribuído via **Expo Application Services (EAS)**. Em desenvolvimento, o ambiente é replicado localmente com **Docker Compose**.

---

## Apresentação Final

O vídeo a seguir apresenta a solução em funcionamento, demonstrando os fluxos principais da plataforma MedHub:

📹 [Assistir ao vídeo de apresentação](assets/video-apresentacao-final.mp4)

📊 [Ver slides da apresentação](assets/medhub-slides-apresentacao-final.pdf)
