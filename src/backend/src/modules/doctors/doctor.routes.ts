import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../middleware/authenticate";

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                user: { select: { id: true, name: true } },
                clinic: { select: { id: true, name: true } },
            },
            orderBy: { specialty: "asc" },
        });
        const payload = doctors.map(({ id, specialty, user, clinic }) => ({
            id,
            name: user.name,
            specialty,
            clinic: clinic?.name ?? "",
        }));
        return res.json(payload);
    } catch (err) {
        return next(err);
    }
});

export default router;
