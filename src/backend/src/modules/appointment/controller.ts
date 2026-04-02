import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppointmentRepository } from "./repository";
import { CreateAppointmentService } from "./service";

const createAppointmentBodySchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  date: z.string().datetime(),
  notes: z.string().optional(),
});

export class AppointmentController {
  private readonly service = new CreateAppointmentService(new AppointmentRepository());

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, doctorId, date, notes } = createAppointmentBodySchema.parse(req.body);

      const appointment = await this.service.execute({
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
}
