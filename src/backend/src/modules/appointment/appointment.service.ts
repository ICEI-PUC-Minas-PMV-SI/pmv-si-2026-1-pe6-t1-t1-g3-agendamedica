import { AppointmentRepository, CreateAppointmentDTO } from "./appointment.repository";

export class CreateAppointmentService {
    constructor(private readonly repository: AppointmentRepository) {}

    async execute(data: CreateAppointmentDTO) {
        if (data.date < new Date()) {
            throw new Error("A data da consulta deve ser no futuro.");
        }

        const patientExists = await this.repository.existsPatient(data.patientId);
        if (!patientExists) {
            throw new Error("Paciente não encontrado. Use um patientId válido.");
        }

        const doctorExists = await this.repository.existsDoctor(data.doctorId);
        if (!doctorExists) {
            throw new Error("Médico não encontrado. Use um doctorId válido.");
        }

        const conflict = await this.repository.findConflictingAppointment(
            data.doctorId,
            data.date,
        );
        if (conflict) {
            throw new Error(`Horário indisponível. Há um conflito com outra consulta já agendada próxima às ${conflict.date.toLocaleString('pt-BR', { timeZone: 'UTC' })}.`);
        }

        return this.repository.create(data);
    }
}

export class ListAppointmentsByUserService {
    constructor(private readonly repository: AppointmentRepository) {}

    async execute(userId: string) {
        return this.repository.findByUser(userId);
    }
}

export class GetAppointmentService {
    constructor(private readonly repository: AppointmentRepository) {}

    async execute(appointmentId: string, userId: string, userRole?: string) {
        const appointment = await this.repository.findById(appointmentId);
        if (!appointment) {
            throw new Error("Consulta não encontrada.");
        }

        if (
            userRole !== "RECEPTIONIST" &&
            appointment.patientId !== userId &&
            appointment.doctorId !== userId
        ) {
            throw new Error("Acesso negado: Essa consulta não pertence ao usuário autenticado.");
        }

        return appointment;
    }
}

export class CancelAppointmentService {
    constructor(private readonly repository: AppointmentRepository) {}

    async execute(appointmentId: string) {
        return this.repository.cancelAppointment(appointmentId);
    }
}

export class ConfirmAppointmentService {
    constructor(private readonly repository: AppointmentRepository) {}

    async execute(appointmentId: string) {
        return this.repository.confirmAppointment(appointmentId);
    }
}

export class UpdateAppointmentService {
    constructor(private readonly repository: AppointmentRepository) {}

    async execute(
        appointmentId: string,
        data: Partial<CreateAppointmentDTO>,
        userId: string,
        userRole?: string
    ) {
        const appointment = await this.repository.findById(appointmentId);
        if (!appointment) {
            throw new Error("Consulta não encontrada.");
        }

        // Validação de acesso estrita (Recepção edita tudo; Paciente só os seus)
        if (
            userRole !== "RECEPTIONIST" &&
            appointment.patientId !== userId &&
            appointment.doctorId !== userId
        ) {
            throw new Error("Acesso negado: Você só pode editar as suas próprias consultas.");
        }

        // Se estiver alterando a data ou o médico, verifica conflitos de horário novamente
        if (data.date || data.doctorId) {
            const dateToCheck = data.date || appointment.date;
            const doctorToCheck = data.doctorId || appointment.doctorId;

            const conflict = await this.repository.findConflictingAppointment(
                doctorToCheck,
                dateToCheck
            );

            if (conflict && conflict.id !== appointmentId) {
                throw new Error(`Horário indisponível. Conflito com consulta próxima às ${conflict.date.toLocaleString('pt-BR', { timeZone: 'UTC' })}.`);
            }
        }

        return this.repository.updateAppointment(appointmentId, data);
    }
}
