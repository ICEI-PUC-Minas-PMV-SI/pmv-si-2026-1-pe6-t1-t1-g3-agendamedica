import { AppointmentRepository, CreateAppointmentDTO } from "./repository";

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

    return this.repository.create(data);
  }
}

export class ListAppointmentsByUserService {
  constructor(private readonly repository: AppointmentRepository) {}

  async execute(userId: string) {
    return this.repository.findByUser(userId);
  }
}
