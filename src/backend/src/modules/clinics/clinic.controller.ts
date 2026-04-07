import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response) {
    try {
        const { name, address, phone } = req.body;
        const clinic = await prisma.clinic.create({
            data: { name, address, phone },
        });
        res.status(201).json(clinic);
    } catch (error: any) {
        res.status(400).json({ message: "Erro ao criar clínica: " + error.message });
    }
}

export async function listAll(req: Request, res: Response) {
    try {
        const clinics = await prisma.clinic.findMany({
            include: { doctors: true },
        });
        res.status(200).json(clinics);
    } catch (error: any) {
        res.status(400).json({ message: "Erro ao listar clínicas: " + error.message });
    }
}
