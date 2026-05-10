import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { RegisterInput, LoginInput } from "./auth.schema";

class AuthError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

class AuthService {
    async register(data: RegisterInput) {
        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.$transaction(async (tx) => {
            const existing = await tx.user.findFirst({
                where: {
                    OR: [{ email: data.email }, ...(data.cpf ? [{ cpf: data.cpf }] : [])],
                },
            });

            if (existing) {
                throw new AuthError("E-mail ou CPF já cadastrado", 400);
            }

            const createdUser = await tx.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    cpf: data.cpf!,
                    passwordHash,
                    role: data.role,
                },
            });

            if (data.role === UserRole.DOCTOR) {
                await tx.doctor.create({
                    data: {
                        userId: createdUser.id,
                        specialty: data.specialty!,
                        crm: data.crm!,
                    },
                });
            }

            return createdUser;
        });

        const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {});

        // busca dados do médico se for DOCTOR
        const doctor =
            user.role === UserRole.DOCTOR
                ? await prisma.doctor.findUnique({ where: { userId: user.id } })
                : null;

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                ...(doctor && { crm: doctor.crm, specialty: doctor.specialty }),
            },
        };
    }

    async login(data: LoginInput) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });

        if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
            throw new AuthError("Credenciais inválidas", 401);
        }

        const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {});

        // busca dados do médico se for DOCTOR
        const doctor =
            user.role === UserRole.DOCTOR
                ? await prisma.doctor.findUnique({ where: { userId: user.id } })
                : null;

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                ...(doctor && { crm: doctor.crm, specialty: doctor.specialty }),
            },
        };
    }
}

export const authService = new AuthService();
export { AuthError };
