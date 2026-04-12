// Uso: node scripts/seed.js
// Cria dados de teste: 3 pacientes, 2 médicos (com clínica), 12 consultas e 4 notificações.
// Idempotente — pode ser re-executado sem duplicar dados.
require("dotenv/config");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    // Clínica
    const clinic = await prisma.clinic.upsert({
        where: { id: "00000000-0000-0000-0000-000000000001" },
        update: {},
        create: {
            id: "00000000-0000-0000-0000-000000000001",
            name: "Clínica MedHub",
            address: "Av. Paulista, 1000 — São Paulo/SP",
            phone: "(11) 99999-0000",
        },
    });

    // Paciente
    const patient = await prisma.user.upsert({
        where: { email: "paciente@medhub.dev" },
        update: {},
        create: {
            name: "Ana Paciente",
            email: "paciente@medhub.dev",
            cpf: "111.111.111-11",
            passwordHash: "hash-de-teste",
            role: "PATIENT",
        },
    });

    // Médico (User + Doctor)
    const doctorUser = await prisma.user.upsert({
        where: { email: "medico@medhub.dev" },
        update: {},
        create: {
            name: "Dr. Carlos Médico",
            email: "medico@medhub.dev",
            cpf: "222.222.222-22",
            passwordHash: "hash-de-teste",
            role: "DOCTOR",
        },
    });

    const doctor = await prisma.doctor.upsert({
        where: { userId: doctorUser.id },
        update: {},
        create: {
            userId: doctorUser.id,
            specialty: "Cardiologia",
            crm: "CRM-SP-12345",
            clinicId: clinic.id,
        },
    });

    // Consulta
    const appointment = await prisma.appointment.upsert({
        where: { id: "00000000-0000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-0000-0000-0000-000000000002",
            patientId: patient.id,
            doctorId: doctor.id,
            date: new Date(Date.now() + 24 * 60 * 60 * 1000), // amanhã
            status: "PENDING",
            notes: "Primeira consulta de teste",
        },
    });

    // Segundo paciente (para testar isolamento de notificações)
    const patient2 = await prisma.user.upsert({
        where: { email: "paciente2@medhub.dev" },
        update: {},
        create: {
            name: "Bruno Paciente",
            email: "paciente2@medhub.dev",
            cpf: "333.333.333-33",
            passwordHash: "hash-de-teste",
            role: "PATIENT",
        },
    });

    // Pacientes
    const patient3 = await prisma.user.upsert({
        where: { email: "paciente3@medhub.dev" },
        update: {},
        create: {
            name: "Célia Paciente",
            email: "paciente3@medhub.dev",
            cpf: "666.666.666-66",
            passwordHash: "hash-de-teste",
            role: "PATIENT",
        },
    });

    // Médicos
    const doctorUser2 = await prisma.user.upsert({
        where: { email: "medico2@medhub.dev" },
        update: {},
        create: {
            name: "Dra. Maria Médica",
            email: "medico2@medhub.dev",
            cpf: "444.444.444-44",
            passwordHash: "hash-de-teste",
            role: "DOCTOR",
        },
    });

    const doctor2 = await prisma.doctor.upsert({
        where: { userId: doctorUser2.id },
        update: {},
        create: {
            userId: doctorUser2.id,
            specialty: "Ortopedia",
            crm: "CRM-SP-54321",
            clinicId: clinic.id,
        },
    });

    // Consultas
    // Consulta 2 (Ana P1 c/ Med 1)
    await prisma.appointment.upsert({
        where: { id: "00000000-1000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-1000-0000-0000-000000000002",
            patientId: patient.id,
            doctorId: doctor.id,
            date: new Date(Date.now() + 25 * 60 * 60 * 1000), // amanhã + 1h
            status: "CONFIRMED",
            notes: "Segunda consulta. Ana",
        },
    });

    // Consulta 3 (Ana P1 c/ Med 2)
    await prisma.appointment.upsert({
        where: { id: "00000000-2000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-2000-0000-0000-000000000002",
            patientId: patient.id,
            doctorId: doctor2.id,
            date: new Date(Date.now() + 26 * 60 * 60 * 1000), // amanhã + 2h
            status: "CONFIRMED",
            notes: "Terceira consulta. Ana (Médica 2)",
        },
    });

    // Consulta 4 (Ana P1 c/ Med 2)
    await prisma.appointment.upsert({
        where: { id: "00000000-3000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-3000-0000-0000-000000000002",
            patientId: patient.id,
            doctorId: doctor2.id,
            date: new Date(Date.now() + 27 * 60 * 60 * 1000), // amanhã + 3h
            status: "PENDING",
            notes: "Quarta consulta. Ana (Médica 2)",
        },
    });

    // Consulta 5 (Bruno P2 c/ Med 1)
    await prisma.appointment.upsert({
        where: { id: "00000000-4000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-4000-0000-0000-000000000002",
            patientId: patient2.id,
            doctorId: doctor.id,
            date: new Date(Date.now() + 28 * 60 * 60 * 1000), // amanhã + 4h
            status: "CONFIRMED",
            notes: "Primeira consulta livre. Bruno",
        },
    });

    // Consulta 6 (Bruno P2 c/ Med 1)
    await prisma.appointment.upsert({
        where: { id: "00000000-5000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-5000-0000-0000-000000000002",
            patientId: patient2.id,
            doctorId: doctor.id,
            date: new Date(Date.now() + 29 * 60 * 60 * 1000), // amanhã + 5h
            status: "PENDING",
            notes: "Segunda consulta. Bruno",
        },
    });

    // Consulta 7 (Bruno P2 c/ Med 2)
    await prisma.appointment.upsert({
        where: { id: "00000000-6000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-6000-0000-0000-000000000002",
            patientId: patient2.id,
            doctorId: doctor2.id,
            date: new Date(Date.now() + 30 * 60 * 60 * 1000), // amanhã + 6h
            status: "CONFIRMED",
            notes: "Terceira consulta. Bruno",
        },
    });

    // Consulta 8 (Bruno P2 c/ Med 2)
    await prisma.appointment.upsert({
        where: { id: "00000000-7000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-7000-0000-0000-000000000002",
            patientId: patient2.id,
            doctorId: doctor2.id,
            date: new Date(Date.now() + 31 * 60 * 60 * 1000), // amanhã + 7h
            status: "PENDING",
            notes: "Quarta consulta. Bruno",
        },
    });

    // Consulta 9 (Célia P3 c/ Med 1)
    await prisma.appointment.upsert({
        where: { id: "00000000-8000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-8000-0000-0000-000000000002",
            patientId: patient3.id,
            doctorId: doctor.id,
            date: new Date(Date.now() + 32 * 60 * 60 * 1000), // amanhã + 8h
            status: "CONFIRMED",
            notes: "Primeira consulta. Célia",
        },
    });

    // Consulta 10 (Célia P3 c/ Med 1)
    await prisma.appointment.upsert({
        where: { id: "00000000-9000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-9000-0000-0000-000000000002",
            patientId: patient3.id,
            doctorId: doctor.id,
            date: new Date(Date.now() + 33 * 60 * 60 * 1000), // amanhã + 9h
            status: "PENDING",
            notes: "Segunda consulta. Célia",
        },
    });

    // Consulta 11 (Célia P3 c/ Med 2)
    await prisma.appointment.upsert({
        where: { id: "00000000-A000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-A000-0000-0000-000000000002",
            patientId: patient3.id,
            doctorId: doctor2.id,
            date: new Date(Date.now() + 34 * 60 * 60 * 1000), // amanhã + 10h
            status: "CONFIRMED",
            notes: "Terceira consulta. Célia",
        },
    });

    // Consulta 12 (Célia P3 c/ Med 2)
    await prisma.appointment.upsert({
        where: { id: "00000000-B000-0000-0000-000000000002" },
        update: {},
        create: {
            id: "00000000-B000-0000-0000-000000000002",
            patientId: patient3.id,
            doctorId: doctor2.id,
            date: new Date(Date.now() + 35 * 60 * 60 * 1000), // amanhã + 11h
            status: "PENDING",
            notes: "Quarta consulta. Célia",
        },
    });

    // Notificações do paciente 1 — IDs determinísticos para skipDuplicates funcionar
    await prisma.notification.createMany({
        skipDuplicates: true,
        data: [
            {
                id: "00000000-0000-0000-0000-000000000010",
                userId: patient.id,
                type: "APPOINTMENT_CREATED",
                title: "Consulta agendada",
                message: `Sua consulta com ${doctorUser.name} foi agendada.`,
                appointmentId: appointment.id,
                read: false,
            },
            {
                id: "00000000-0000-0000-0000-000000000011",
                userId: patient.id,
                type: "APPOINTMENT_CONFIRMED",
                title: "Consulta confirmada",
                message: `Sua consulta com ${doctorUser.name} foi confirmada.`,
                appointmentId: appointment.id,
                read: false,
            },
            {
                id: "00000000-0000-0000-0000-000000000012",
                userId: patient.id,
                type: "APPOINTMENT_CANCELLED",
                title: "Consulta cancelada",
                message: "Uma consulta anterior foi cancelada. Esta é uma notificação lida.",
                read: true,
            },
        ],
    });

    // Notificação do paciente 2 (não deve aparecer para o paciente 1)
    await prisma.notification.createMany({
        skipDuplicates: true,
        data: [
            {
                id: "00000000-0000-0000-0000-000000000020",
                userId: patient2.id,
                type: "APPOINTMENT_CREATED",
                title: "Consulta agendada — Bruno",
                message: `Consulta de Bruno com ${doctorUser.name} foi agendada.`,
                appointmentId: appointment.id,
                read: false,
            },
        ],
    });

    console.log("✔ Clínica:      ", clinic.name, `(${clinic.id})`);
    console.log("✔ Paciente 1:   ", patient.name, `(${patient.id})`);
    console.log("✔ Paciente 2:   ", patient2.name, `(${patient2.id})`);
    console.log("✔ Paciente 3:   ", patient3.name, `(${patient3.id})`);
    console.log("✔ Médico:       ", doctorUser.name, `(${doctorUser.id})`);
    console.log("✔ Médico 2:     ", doctorUser2.name, `(${doctorUser2.id})`);
    console.log("✔ Consulta:     ", appointment.id, `— ${appointment.date.toISOString()}`);
    console.log("✔ Notificações:  3 para paciente 1, 1 para paciente 2");
    console.log("");
    console.log("Tokens JWT:");
    console.log("  paciente 1 →", `node scripts/gen-token.js ${patient.id}`);
    console.log("  paciente 2 →", `node scripts/gen-token.js ${patient2.id}`);
    console.log("  paciente 3 →", `node scripts/gen-token.js ${patient3.id}`);
    console.log("  médico     →", `node scripts/gen-token.js ${doctorUser.id}`);
    console.log("  médico 2   →", `node scripts/gen-token.js ${doctorUser2.id}`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
