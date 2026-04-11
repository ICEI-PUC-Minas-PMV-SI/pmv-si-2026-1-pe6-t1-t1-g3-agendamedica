import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppointmentRepository } from "./appointment.repository";
import {
    CreateAppointmentService,
    ListAppointmentsByUserService,
    CancelAppointmentService,
    ConfirmAppointmentService,
    GetAppointmentService,
    UpdateAppointmentService,
} from "./appointment.service";

const createAppointmentBodySchema = z.object({
    patientId: z.string().uuid(),
    doctorId: z.string().uuid(),
    date: z.string().datetime(),
    notes: z.string().optional(),
});

const listAppointmentsBodySchema = z.object({
    userId: z.string().uuid(),
});

const cancelAppointmentBodySchema = z.object({
    appointmentId: z.string().uuid(),
});

const updateAppointmentBodySchema = z.object({
    doctorId: z.string().uuid().optional(),
    date: z.string().datetime().optional(),
    notes: z.string().optional(),
});

export class AppointmentController {
    private readonly createService = new CreateAppointmentService(new AppointmentRepository());
    private readonly listService = new ListAppointmentsByUserService(new AppointmentRepository());
    private readonly cancelService = new CancelAppointmentService(new AppointmentRepository());
    private readonly confirmService = new ConfirmAppointmentService(new AppointmentRepository());
    private readonly getService = new GetAppointmentService(new AppointmentRepository());
    private readonly updateService = new UpdateAppointmentService(new AppointmentRepository());

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { patientId, doctorId, date, notes } = createAppointmentBodySchema.parse(
                req.body,
            );

            // Validação de Segurança para o paciente poder cadastrar consultas somente para si mesmo.
            if (req.userRole !== "RECEPTIONIST" && patientId !== req.userId) {
                return res.status(403).json({
                    error: "Acesso negado: O patientId enviado não pertence ao seu usuário atual.",
                });
            }

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

    async listAppointments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado." });
            }
            const appointments = await this.listService.execute(userId, req.userRole);
            return res.status(200).json(appointments);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return next(error);
        }
    }

    async cancel(req: Request, res: Response, next: NextFunction) {
        try {
            const { appointmentId } = cancelAppointmentBodySchema.parse(req.body);

            const appointment = await this.cancelService.execute(appointmentId);
            return res.status(200).json(appointment);
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

    async confirm(req: Request, res: Response, next: NextFunction) {
        try {
            const { appointmentId } = z
                .object({ appointmentId: z.string().uuid() })
                .parse(req.body);

            const appointment = await this.confirmService.execute(appointmentId);
            return res.status(200).json(appointment);
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

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const userRole = req.userRole;

            if (!userId || !userRole) {
                return res.status(401).json({ error: "Usuário não autenticado." });
            }

            const appointment = await this.getService.execute(id, userId, userRole);
            return res.status(200).json(appointment);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ error: error.message });
            }
            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const parsedData = updateAppointmentBodySchema.parse(req.body);

            // Permite edição enviando apenas os nós que se deseja mudar, mantendo os demais.
            const payload = {
                ...(parsedData.doctorId && { doctorId: parsedData.doctorId }),
                ...(parsedData.date && { date: new Date(parsedData.date) }),
                ...(parsedData.notes !== undefined && { notes: parsedData.notes }),
            };

            const appointment = await this.updateService.execute(id, payload, req.userId!, req.userRole);
            return res.status(200).json(appointment);
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
