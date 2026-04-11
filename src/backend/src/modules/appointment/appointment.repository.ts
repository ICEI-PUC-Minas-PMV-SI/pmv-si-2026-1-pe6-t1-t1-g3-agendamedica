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
        OR: [{ patientId: userId }, { doctorId: userId }],
      },
      orderBy: { date: "asc" },
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
}
