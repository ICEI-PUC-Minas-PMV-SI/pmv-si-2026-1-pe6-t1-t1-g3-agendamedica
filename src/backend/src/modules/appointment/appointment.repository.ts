import { PrismaClient, Appointment } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateAppointmentDTO = {
    patientId: string;
    doctorId: string;
    date: Date;
    notes?: string | null;
};

export class AppointmentRepository {
    async existsPatient(patientId: string): Promise<boolean> {
        const patient = await prisma.user.findUnique({
            where: { id: patientId },
        });
        return Boolean(patient);
    }

    async existsDoctor(doctorId: string): Promise<boolean> {
        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId },
        });
        return Boolean(doctor);
    }

    async findConflictingAppointment(doctorId: string, date: Date): Promise<Appointment | null> {
        // Consideramos que cada consulta dure em média 20 minutos
        const appointmentDurationMs = 20 * 60 * 1000; 
        const startWindow = new Date(date.getTime() - appointmentDurationMs);
        const endWindow = new Date(date.getTime() + appointmentDurationMs);

        const conflict = await prisma.appointment.findFirst({
            where: {
                doctorId,
                status: { not: "CANCELLED" },
                date: {
                    gt: startWindow,
                    lt: endWindow,
                },
            },
        });
        return conflict;
    }

    async create(data: CreateAppointmentDTO): Promise<Appointment> {
        return prisma.appointment.create({
            data: {
                patientId: data.patientId,
                doctorId: data.doctorId,
                date: data.date,
                notes: data.notes,
                status: "PENDING",
            },
        });
    }

    async findByUser(userId: string): Promise<Appointment[]> {
        return prisma.appointment.findMany({
            where: {
                OR: [
                    { patientId: userId },
                    { doctor: { userId } },
                ],
            },
            orderBy: { date: "asc" },
        });
    }

    async findById(appointmentId: string): Promise<Appointment | null> {
        return prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
    }

    async cancelAppointment(appointmentId: string): Promise<Appointment> {
        const existingAppointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!existingAppointment) {
            throw new Error("Consulta não encontrada.");
        }

        return prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: "CANCELLED" },
        });
    }

    async confirmAppointment(appointmentId: string): Promise<Appointment> {
        const existingAppointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!existingAppointment) {
            throw new Error("Consulta não encontrada.");
        }

        return prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: "CONFIRMED" },
        });
    }
}
