import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { RegisterDTO, LoginDTO } from "./auth.dto";

const prisma = new PrismaClient();

export async function registerUser(data: RegisterDTO) {
    // Verifica se e-mail já existe
    const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (emailExists) {
        throw new Error("E-mail já cadastrado!");
    }

    // Verifica se CPF já existe
    const cpfExists = await prisma.user.findUnique({
        where: { cpf: data.cpf },
    });
    if (cpfExists) {
        throw new Error("CPF já cadastrado!");
    }

    // Se for médico, valida os campos obrigatórios antes de persistir
    if (data.role === "DOCTOR" && (!data.specialty || !data.crm)) {
        throw new Error("Especialidade e CRM são obrigatórios para médico");
    }

    // Criptografa a senha
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                cpf: data.cpf,
                passwordHash,
                role: data.role,
            },
        });

        // Se for médico, cria o registro na tabela Doctor
        if (data.role === "DOCTOR") {
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
    return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function loginUser(data: LoginDTO) {
    // Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new Error("Credenciais inválidas");
    }

    // Compara a senha com o hash salvo no banco
    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatch) {
        throw new Error("Credenciais inválidas");
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    return { token, user: { id: user.id, name: user.name, role: user.role } };
}
