import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDTO, LoginDTO } from "./auth.dto";

const prisma = new PrismaClient();

function badRequest(message: string) {
    throw Object.assign(new Error(message), { status: 400 });
}

export async function registerUser(data: RegisterDTO) {
    const specialty = data.specialty?.trim();
    const crm = data.crm?.trim();

    // Validações específicas para médico
    if (data.role === "DOCTOR") {
        if (!specialty) {
            badRequest("Especialidade é obrigatória para médico.");
        }
        if (!crm) {
            badRequest("CRM é obrigatório para médico.");
        }
    }

    // Criptografa a senha
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Transaction para garantir atomicidade
    const user = await prisma.$transaction(async (tx) => {
        // Verifica e-mail
        const emailExists = await tx.user.findUnique({
            where: { email: data.email },
        });
        if (emailExists) {
            badRequest("E-mail já cadastrado!");
        }

        // Verifica CPF
        const cpfExists = await tx.user.findUnique({
            where: { cpf: data.cpf },
        });
        if (cpfExists) {
            badRequest("CPF já cadastrado!");
        }

        // Verifica CRM se for médico
        if (data.role === "DOCTOR") {
            const crmExists = await tx.doctor.findUnique({
                where: { crm: crm! },
            });
            if (crmExists) {
                badRequest("CRM já cadastrado!");
            }
        }

        // Cria usuário
        const createdUser = await tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                cpf: data.cpf,
                passwordHash,
                role: data.role,
            },
        });

        // Cria médico, se aplicável
        if (data.role === "DOCTOR") {
            await tx.doctor.create({
                data: {
                    userId: createdUser.id,
                    specialty: specialty!,
                    crm: crm!,
                },
            });
        }

        return createdUser;
    });

    // Retorno seguro (sem senha)
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

export async function loginUser(data: LoginDTO) {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw Object.assign(new Error("Credenciais inválidas"), { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordMatch) {
        throw Object.assign(new Error("Credenciais inválidas"), { status: 401 });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            role: user.role,
        },
    };
}
