// Uso: node scripts/seed.js
// Cria dados de teste: 1 paciente, 1 médico (com clínica), 1 consulta e 3 notificações.
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

    // Notificações do paciente 1
    await prisma.notification.createMany({
        skipDuplicates: true,
        data: [
            {
                userId: patient.id,
                type: "APPOINTMENT_CREATED",
                title: "Consulta agendada",
                message: `Sua consulta com ${doctorUser.name} foi agendada.`,
                appointmentId: appointment.id,
                read: false,
            },
            {
                userId: patient.id,
                type: "APPOINTMENT_CONFIRMED",
                title: "Consulta confirmada",
                message: `Sua consulta com ${doctorUser.name} foi confirmada.`,
                appointmentId: appointment.id,
                read: false,
            },
            {
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
    console.log("✔ Médico:       ", doctorUser.name, `(${doctorUser.id})`);
    console.log("✔ Consulta:     ", appointment.id, `— ${appointment.date.toISOString()}`);
    console.log("✔ Notificações:  3 para paciente 1, 1 para paciente 2");
    console.log("");
    console.log("Tokens JWT:");
    console.log("  paciente 1 →", `node scripts/gen-token.js ${patient.id}`);
    console.log("  paciente 2 →", `node scripts/gen-token.js ${patient2.id}`);
    console.log("  médico     →", `node scripts/gen-token.js ${doctorUser.id}`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
