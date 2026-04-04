// Uso: node scripts/clear-db.js
// Remove todos os dados do banco na ordem correta (foreign keys).
// NÃO remove as tabelas — apenas limpa os registros.
require("dotenv/config");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const n = await prisma.notification.deleteMany();
    const a = await prisma.appointment.deleteMany();
    const d = await prisma.doctor.deleteMany();
    const u = await prisma.user.deleteMany();
    const c = await prisma.clinic.deleteMany();

    console.log(`✔ Notifications deletadas: ${n.count}`);
    console.log(`✔ Appointments deletados:  ${a.count}`);
    console.log(`✔ Doctors deletados:       ${d.count}`);
    console.log(`✔ Users deletados:         ${u.count}`);
    console.log(`✔ Clinics deletadas:       ${c.count}`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
