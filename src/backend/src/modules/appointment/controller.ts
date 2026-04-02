import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppointmentRepository } from "./repository";
import { CreateAppointmentService, ListAppointmentsByUserService } from "./service";

const createAppointmentBodySchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  date: z.string().datetime(),
  notes: z.string().optional(),
});

const listAppointmentsBodySchema = z.object({
  userId: z.string().uuid(),
});

export class AppointmentController {
  private readonly createService = new CreateAppointmentService(new AppointmentRepository());
  private readonly listService = new ListAppointmentsByUserService(new AppointmentRepository());

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, doctorId, date, notes } = createAppointmentBodySchema.parse(req.body);

      const appointment = await this.createService.execute({
        patientId,
        doctorId,
        date: new Date(date),
        notes,
      });

      return res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return next(error);
    }
  }

  async listByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = listAppointmentsBodySchema.parse(req.body);

      const appointments = await this.listService.execute(userId);
      return res.status(200).json(appointments);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return next(error);
    }
  }
}
